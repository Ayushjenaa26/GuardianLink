const RoleRequest = require('../../models/AdminSide/RoleRequest');
const AdminTeacher = require('../../models/AdminSide/AdminTeacher');

// Get all role requests (with filtering)
exports.getAllRoleRequests = async (req, res) => {
  try {
    console.log('📥 Get all role requests');
    console.log('👤 User:', req.user?.email, 'Role:', req.user?.role);

    const { status } = req.query;
    
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const requests = await RoleRequest.find(filter)
      .populate('teacher', 'teacherName email employeeId')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${requests.length} role requests`);
    res.json(requests);
  } catch (error) {
    console.error('❌ Error fetching role requests:', error);
    res.status(500).json({ 
      message: 'Error fetching role requests', 
      error: error.message 
    });
  }
};

// Get role requests for a specific teacher
exports.getTeacherRoleRequests = async (req, res) => {
  try {
    console.log('📥 Get teacher role requests');
    console.log('👤 User:', req.user?.email, 'ID:', req.user?.id);

    // Find teacher by email
    const teacher = await AdminTeacher.findOne({ email: req.user.email });
    
    if (!teacher) {
      console.log('⚠️ Teacher not found in AdminTeacher collection, returning empty array');
      return res.json([]);
    }

    const requests = await RoleRequest.find({ teacher: teacher._id })
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${requests.length} requests for teacher`);
    res.json(requests);
  } catch (error) {
    console.error('❌ Error fetching teacher requests:', error);
    res.status(500).json({ 
      message: 'Error fetching your requests', 
      error: error.message 
    });
  }
};

// Create new role request (teacher)
exports.createRoleRequest = async (req, res) => {
  try {
    console.log('📥 Create role request');
    console.log('👤 User:', req.user?.email, 'ID:', req.user?.id);
    console.log('📝 Request data:', req.body);

    const { requestedSubjects, requestMessage, department } = req.body;

    // Validate input
    if (!department) {
      return res.status(400).json({ 
        message: 'Please select a department' 
      });
    }

    if (!requestedSubjects || !Array.isArray(requestedSubjects) || requestedSubjects.length === 0) {
      return res.status(400).json({ 
        message: 'Please select at least one subject' 
      });
    }

    // Find teacher by email in AdminTeacher collection
    let teacher = await AdminTeacher.findOne({ email: req.user.email });
    
    if (!teacher) {
      console.log('⚠️ Teacher not found in AdminTeacher collection, checking regular Teacher collection...');
      
      // If not found in AdminTeacher, try to get info from the authenticated user
      if (req.user && req.user.email) {
        // Create AdminTeacher record from the authenticated teacher
        teacher = new AdminTeacher({
          teacherName: req.user.name || 'Teacher',
          email: req.user.email,
          employeeId: `TCH-${Date.now().toString().slice(-6)}`, // Generate temporary ID
          subject: req.user.subject || requestedSubjects[0],
          phone: '',
          department: '',
          experience: '',
          status: 'Active'
        });
        
        await teacher.save();
        console.log('✅ Created AdminTeacher record:', teacher._id);
      } else {
        return res.status(404).json({ 
          message: 'Teacher not found' 
        });
      }
    }

    // Check for pending requests
    const existingRequest = await RoleRequest.findOne({
      teacher: teacher._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending request. Please wait for admin approval.' 
      });
    }

    // Create new request
    const roleRequest = new RoleRequest({
      teacher: teacher._id,
      teacherName: teacher.teacherName,
      teacherEmail: teacher.email,
      employeeId: teacher.employeeId,
      department,
      requestedClasses: [],
      requestedSubjects,
      requestMessage: requestMessage || ''
    });

    await roleRequest.save();

    console.log('✅ Role request created:', roleRequest._id);
    res.status(201).json({
      message: 'Role request submitted successfully',
      request: roleRequest
    });
  } catch (error) {
    console.error('❌ Error creating role request:', error);
    res.status(500).json({ 
      message: 'Error submitting role request', 
      error: error.message 
    });
  }
};

// Approve role request (admin)
exports.approveRoleRequest = async (req, res) => {
  try {
    console.log('📥 Approve role request:', req.params.id);
    console.log('👤 Admin:', req.user?.email, 'ID:', req.user?.id);

    const { adminResponse, classes, semester } = req.body;

    // Validate classes
    if (!classes || !Array.isArray(classes) || classes.length === 0) {
      return res.status(400).json({ 
        message: 'Please select at least one class to assign' 
      });
    }

    const roleRequest = await RoleRequest.findById(req.params.id);
    
    if (!roleRequest) {
      return res.status(404).json({ 
        message: 'Role request not found' 
      });
    }

    if (roleRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: 'This request has already been processed' 
      });
    }

    // Update teacher with assigned classes and subjects
    const teacher = await AdminTeacher.findById(roleRequest.teacher);
    
    if (!teacher) {
      return res.status(404).json({ 
        message: 'Teacher not found' 
      });
    }

    // Merge with existing assignments (avoid duplicates)
    const updatedClasses = [...new Set([
      ...(teacher.assignedClasses || []),
      ...classes
    ])];

    const updatedSubjects = [...new Set([
      ...(teacher.assignedSubjects || []),
      ...roleRequest.requestedSubjects
    ])];

    teacher.assignedClasses = updatedClasses;
    teacher.assignedSubjects = updatedSubjects;
    if (semester) teacher.semester = semester;
    teacher.lastAssignedAt = new Date();
    teacher.assignedBy = req.user.id;

    await teacher.save();

    // Update request with assigned classes
    roleRequest.requestedClasses = classes;
    roleRequest.status = 'approved';
    roleRequest.adminResponse = adminResponse || 'Your request has been approved';
    roleRequest.reviewedBy = req.user.id;
    roleRequest.reviewedAt = new Date();

    await roleRequest.save();

    console.log('✅ Role request approved and teacher updated');
    res.json({
      message: 'Role request approved successfully',
      request: roleRequest,
      teacher: {
        id: teacher._id,
        assignedClasses: teacher.assignedClasses,
        assignedSubjects: teacher.assignedSubjects,
        semester: teacher.semester
      }
    });
  } catch (error) {
    console.error('❌ Error approving role request:', error);
    res.status(500).json({ 
      message: 'Error approving role request', 
      error: error.message 
    });
  }
};

// Reject role request (admin)
exports.rejectRoleRequest = async (req, res) => {
  try {
    console.log('📥 Reject role request:', req.params.id);
    console.log('👤 Admin:', req.user?.email, 'ID:', req.user?.id);

    const { adminResponse } = req.body;

    if (!adminResponse || adminResponse.trim() === '') {
      return res.status(400).json({ 
        message: 'Please provide a reason for rejection' 
      });
    }

    const roleRequest = await RoleRequest.findById(req.params.id);
    
    if (!roleRequest) {
      return res.status(404).json({ 
        message: 'Role request not found' 
      });
    }

    if (roleRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: 'This request has already been processed' 
      });
    }

    // Update request status
    roleRequest.status = 'rejected';
    roleRequest.adminResponse = adminResponse;
    roleRequest.reviewedBy = req.user.id;
    roleRequest.reviewedAt = new Date();

    await roleRequest.save();

    console.log('✅ Role request rejected');
    res.json({
      message: 'Role request rejected',
      request: roleRequest
    });
  } catch (error) {
    console.error('❌ Error rejecting role request:', error);
    res.status(500).json({ 
      message: 'Error rejecting role request', 
      error: error.message 
    });
  }
};

// Delete role request (admin or teacher who created it)
exports.deleteRoleRequest = async (req, res) => {
  try {
    console.log('📥 Delete role request:', req.params.id);
    console.log('👤 User:', req.user?.email, 'Role:', req.user?.role);

    const roleRequest = await RoleRequest.findById(req.params.id);
    
    if (!roleRequest) {
      return res.status(404).json({ 
        message: 'Role request not found' 
      });
    }

    // Check permissions
    if (req.user.role === 'teacher' && roleRequest.teacher.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'You can only delete your own requests' 
      });
    }

    await roleRequest.deleteOne();

    console.log('✅ Role request deleted');
    res.json({
      message: 'Role request deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting role request:', error);
    res.status(500).json({ 
      message: 'Error deleting role request', 
      error: error.message 
    });
  }
};
