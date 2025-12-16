import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './DataUpload.css';
import { API_URL } from '../config';

function DataUpload({ embedded }) {
  const [activeTab, setActiveTab] = useState('students');
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Expected columns for students and teachers
  const studentColumns = ['Student Name', 'Roll No', 'Email', 'Branch', 'Year', 'Batch', 'Semester', 'GPA', 'Status'];
  const teacherColumns = ['Teacher Name', 'Employee ID', 'Email', 'Subject', 'Phone', 'Department', 'Experience', 'Status'];

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/)) {
        setUploadStatus({ type: 'error', message: 'Please upload a valid Excel file (.xlsx, .xls) or CSV file' });
        return;
      }

      setFile(selectedFile);
      setUploadStatus({ type: '', message: '' });
      parseExcelFile(selectedFile);
    }
  };

  const parseExcelFile = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length > 0) {
          // First row is headers, rest is data
          const headers = jsonData[0];
          const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== null && cell !== ''));
          
          setPreviewData({
            headers,
            rows: rows.slice(0, 10), // Preview first 10 rows
            totalRows: rows.length,
            allRows: rows
          });
          
          setUploadStatus({ 
            type: 'success', 
            message: `File parsed successfully! Found ${rows.length} records.` 
          });
        } else {
          setUploadStatus({ type: 'error', message: 'The file appears to be empty.' });
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        setUploadStatus({ type: 'error', message: 'Error parsing file. Please check the format.' });
      }
    };

    reader.onerror = () => {
      setUploadStatus({ type: 'error', message: 'Error reading file.' });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      parseExcelFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !previewData.allRows || previewData.allRows.length === 0) {
      setUploadStatus({ type: 'error', message: 'Please select a valid file first.' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Prepare data for upload - trim headers and cell values
      const trimmedHeaders = previewData.headers.map(h => (typeof h === 'string' ? h.trim() : h));
      
      const formattedData = previewData.allRows.map(row => {
        const record = {};
        trimmedHeaders.forEach((header, index) => {
          const value = row[index];
          // Trim string values
          const trimmedValue = typeof value === 'string' ? value.trim() : (value || '');
          record[header] = trimmedValue;
        });
        return record;
      });

      console.log('📋 First row of formatted data:', formattedData[0]);
      console.log('📋 Headers:', trimmedHeaders);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const endpoint = activeTab === 'students' 
        ? `${API_URL}/api/admin/upload/students`
        : `${API_URL}/api/admin/upload/teachers`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ data: formattedData })
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({ 
          type: 'success', 
          message: `Successfully uploaded ${result.inserted || formattedData.length} ${activeTab}! ${result.skipped ? `(${result.skipped} duplicates skipped)` : ''}` 
        });
        // Clear the form after successful upload
        setTimeout(() => {
          setFile(null);
          setPreviewData([]);
          setUploadProgress(0);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed with status:', response.status, 'Message:', errorData.message);
        setUploadStatus({ 
          type: 'error', 
          message: errorData.message || `Upload failed (Error ${response.status}). Please try again.` 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: error.message || 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const columns = activeTab === 'students' ? studentColumns : teacherColumns;
    const sampleData = activeTab === 'students' 
      ? [['John Doe', 'STU001', 'john@example.com', 'CSE', '2024', 'A', '1', '3.8', 'Active']]
      : [['Jane Smith', 'TCH001', 'jane@example.com', 'Mathematics', '9876543210', 'Science', '5 Years', 'Active']];

    const ws = XLSX.utils.aoa_to_sheet([columns, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === 'students' ? 'Students' : 'Teachers');
    
    // Set column widths
    const colWidths = columns.map(col => ({ wch: Math.max(col.length + 5, 15) }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${activeTab}_template.xlsx`);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewData([]);
    setUploadStatus({ type: '', message: '' });
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`data-upload-container ${embedded ? 'embedded' : ''}`}>
      {!embedded && (
        <header className="upload-header">
          <h2>📤 Data Upload</h2>
          <p>Import student and teacher data from Excel files</p>
        </header>
      )}

      {embedded && (
        <header className="parent-header">
          <div>
            <h2>Data Upload</h2>
            <span className="parent-welcome">Import student and teacher data from Excel files</span>
          </div>
        </header>
      )}

      {/* Tab Navigation */}
      <div className="upload-tabs">
        <button 
          className={`upload-tab ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => { setActiveTab('students'); clearFile(); }}
        >
          <span>🧑‍🎓</span> Students
        </button>
        <button 
          className={`upload-tab ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('teachers'); clearFile(); }}
        >
          <span>🧑‍🏫</span> Teachers
        </button>
      </div>

      {/* Upload Instructions */}
      <div className="upload-instructions">
        <h3>📋 Required Columns for {activeTab === 'students' ? 'Students' : 'Teachers'}</h3>
        <div className="columns-list">
          {(activeTab === 'students' ? studentColumns : teacherColumns).map((col, index) => (
            <span key={index} className="column-tag">{col}</span>
          ))}
        </div>
        <button className="btn-template" onClick={downloadTemplate}>
          📥 Download Template
        </button>
      </div>

      {/* File Upload Area */}
      <div 
        className={`upload-dropzone ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".xlsx,.xls,.csv"
          style={{ display: 'none' }}
        />
        
        {!file ? (
          <>
            <div className="upload-icon">📁</div>
            <h3>Drag & Drop your Excel file here</h3>
            <p>or click to browse</p>
            <span className="file-types">Supported formats: .xlsx, .xls, .csv</span>
          </>
        ) : (
          <div className="file-info">
            <div className="file-icon">📊</div>
            <div className="file-details">
              <h4>{file.name}</h4>
              <p>{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button className="btn-clear" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Status Message */}
      {uploadStatus.message && (
        <div className={`upload-status ${uploadStatus.type}`}>
          <span>{uploadStatus.type === 'success' ? '✅' : '❌'}</span>
          {uploadStatus.message}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
          </div>
          <span>{uploadProgress}% Complete</span>
        </div>
      )}

      {/* Data Preview */}
      {previewData.headers && previewData.headers.length > 0 && (
        <div className="data-preview">
          <div className="preview-header">
            <h3>📋 Data Preview</h3>
            <span>Showing {Math.min(previewData.rows.length, 10)} of {previewData.totalRows} records</span>
          </div>
          
          <div className="preview-table-wrapper">
            <table className="preview-table">
              <thead>
                <tr>
                  {previewData.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {previewData.headers.map((_, colIndex) => (
                      <td key={colIndex}>{row[colIndex] || '-'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {previewData.totalRows > 10 && (
            <div className="preview-note">
              <span>ℹ️</span> Previewing first 10 rows. All {previewData.totalRows} records will be uploaded.
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {file && previewData.totalRows > 0 && (
        <div className="upload-actions">
          <button 
            className="btn-cancel"
            onClick={clearFile}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button 
            className="btn-upload"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              <>
                📤 Upload {previewData.totalRows} {activeTab}
              </>
            )}
          </button>
        </div>
      )}

      {/* Recent Uploads */}
      <div className="recent-uploads">
        <h3>📜 Upload Guidelines</h3>
        <ul>
          <li>Make sure your Excel file has headers in the first row</li>
          <li>Email addresses must be unique for each {activeTab === 'students' ? 'student' : 'teacher'}</li>
          <li>All required fields must be filled</li>
          <li>Download the template for the correct format</li>
          <li>Maximum 500 records per upload</li>
        </ul>
      </div>
    </div>
  );
}

export default DataUpload;
