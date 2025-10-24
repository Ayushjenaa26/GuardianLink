import React from 'react';
import '../ParentSide/ParentDashboard.css';

const students = [
  {
    name: "Emily Johnson", id: "S1001", grades: { fsd: "A", se: "A", cn: "A", db: "A" }, overall: "A (98%)", attendance: "98%", behavior: "Excellent"
  },
  {
    name: "Michael Rodriguez", id: "S1002", grades: { fsd: "A", se: "A", cn: "A", db: "B" }, overall: "A (96%)", attendance: "96%", behavior: "Good"
  },
  {
    name: "Sarah Chen", id: "S1003", grades: { fsd: "A", se: "A", cn: "B", db: "A" }, overall: "A (95%)", attendance: "97%", behavior: "Good"
  },
  {
    name: "David Wilson", id: "S1004", grades: { fsd: "A", se: "B", cn: "A", db: "A" }, overall: "A (94%)", attendance: "95%", behavior: "Good"
  },
  {
    name: "Amanda Patel", id: "S1005", grades: { fsd: "B", se: "A", cn: "A", db: "B" }, overall: "A (93%)", attendance: "96%", behavior: "Good"
  },
  {
    name: "Thomas Brown", id: "S1006", grades: { fsd: "C", se: "B", cn: "C", db: "B" }, overall: "C (75%)", attendance: "82%", behavior: "Needs Improvement"
  }
];

const behaviorList = [
  { initials: "EJ", name: "Emily Johnson", status: "Excellent" },
  { initials: "MR", name: "Michael Rodriguez", status: "Good" },
  { initials: "TB", name: "Thomas Brown", status: "Needs Improvement" },
  { initials: "JK", name: "Jessica Kim", status: "Good" },
  { initials: "RW", name: "Robert Williams", status: "Concerns" }
];

const subjectPerformance = [
  { icon: "💻", name: "Full Stack Development", percent: "92%" },
  { icon: "🖧", name: "Computer Networks", percent: "88%" },
  { icon: "⚙️", name: "Software Engineering", percent: "85%" },
  { icon: "🗄️", name: "Database Systems", percent: "83%" },
  { icon: "🛡️", name: "Cyber Security", percent: "90%" }
];

const gradeDist = [
  { color: "#22c55e", label: "Grade A (90-100%)", count: 42 },
  { color: "#2563eb", label: "Grade B (80-89%)", count: 65 },
  { color: "#fbbf24", label: "Grade C (70-79%)", count: 48 },
  { color: "#ef4444", label: "Grade D (Below 70%)", count: 25 }
];

const topPerformers = [
  { initials: "EJ", name: "Emily Johnson", percent: "98%" },
  { initials: "MR", name: "Michael Rodriguez", percent: "96%" },
  { initials: "SC", name: "Sarah Chen", percent: "95%" },
  { initials: "DW", name: "David Wilson", percent: "94%" },
  { initials: "AP", name: "Amanda Patel", percent: "93%" }
];

function getGradeColor(grade) {
  if (grade === "A") return "#22c55e";
  if (grade === "B") return "#2563eb";
  if (grade === "C") return "#fbbf24";
  return "#ef4444";
}

function getBehaviorClass(status) {
  if (status === "Excellent") return "behavior-excellent";
  if (status === "Good") return "behavior-good";
  if (status === "Needs Improvement") return "behavior-improve";
  return "behavior-concern";
}

export default function TeacherReports() {
  return (
    <div style={{background:'#f7f8fc', minHeight:'100vh', padding:'32px'}}>
      <div style={{maxWidth:1400, margin:'0 auto'}}>
        <h2 style={{marginBottom:0}}>Student Reports</h2>
        <div style={{color:'#888', marginBottom:24}}>Comprehensive overview of student performance and behavior</div>
        <h1 style={{margin:'24px 0 18px 0'}}>Academic Reports</h1>
        <div style={{display:'flex', gap:24, marginBottom:32}}>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontSize:'2rem', color:'#2563eb'}}>🎓</div>
            <div style={{fontSize:'2rem', fontWeight:600}}>180</div>
            <div style={{color:'#888'}}>Total Students</div>
          </div>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontSize:'2rem', color:'#22c55e'}}>📈</div>
            <div style={{fontSize:'2rem', fontWeight:600}}>87%</div>
            <div style={{color:'#888'}}>Average Performance</div>
          </div>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontSize:'2rem', color:'#fbbf24'}}>📋</div>
            <div style={{fontSize:'2rem', fontWeight:600}}>12</div>
            <div style={{color:'#888'}}>Pending Reviews</div>
          </div>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontSize:'2rem', color:'#ef4444'}}>❗</div>
            <div style={{fontSize:'2rem', fontWeight:600}}>5</div>
            <div style={{color:'#888'}}>At-Risk Students</div>
          </div>
        </div>
        <div style={{display:'flex', gap:24, marginBottom:32}}>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontWeight:600, fontSize:'1.15rem', marginBottom:12}}>Grade Distribution <span style={{float:'right', color:'#6366f1', fontWeight:400, fontSize:'1rem', cursor:'pointer'}}>View Details</span></div>
            <ul style={{listStyle:'none', padding:0, margin:0}}>
              {gradeDist.map(g => (
                <li key={g.label} style={{display:'flex', alignItems:'center', marginBottom:8}}>
                  <span style={{width:12, height:12, borderRadius:'50%', background:g.color, display:'inline-block', marginRight:10}}></span>
                  <span style={{flex:1}}>{g.label}</span>
                  <span style={{color:'#888'}}>{g.count} students</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontWeight:600, fontSize:'1.15rem', marginBottom:12}}>Top Performers <span style={{float:'right', color:'#6366f1', fontWeight:400, fontSize:'1rem', cursor:'pointer'}}>View All</span></div>
            <ul style={{listStyle:'none', padding:0, margin:0}}>
              {topPerformers.map(s => (
                <li key={s.name} style={{display:'flex', alignItems:'center', marginBottom:10}}>
                  <span style={{
                    width:32, height:32, borderRadius:'50%', background:'#f3f3ff', color:'#444', fontWeight:600,
                    display:'flex', alignItems:'center', justifyContent:'center', marginRight:12, fontSize:'1rem'
                  }}>{s.initials}</span>
                  <span style={{flex:1}}>{s.name}</span>
                  <span style={{fontWeight:500}}>{s.percent}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{background:'#fff', borderRadius:16, padding:24, marginBottom:32, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
          <div style={{fontWeight:600, fontSize:'1.15rem', marginBottom:18}}>Detailed Student Reports
            <span style={{float:'right', color:'#6366f1', fontWeight:400, fontSize:'1rem', cursor:'pointer'}}>Export Full Report</span>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%', borderCollapse:'collapse', fontSize:'1rem'}}>
              <thead>
                <tr style={{background:'#f7f8fc'}}>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Student Name</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Student ID</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Full Stack Dev</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Software Eng</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Computer Networks</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Database Systems</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Overall Grade</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Attendance</th>
                  <th style={{padding:'10px 12px', textAlign:'left', fontWeight:600}}>Behavior</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} style={{borderBottom:'1px solid #f3f3ff'}}>
                    <td style={{padding:'10px 12px'}}>{s.name}</td>
                    <td style={{padding:'10px 12px'}}>{s.id}</td>
                    <td style={{padding:'10px 12px', color:getGradeColor(s.grades.fsd), fontWeight:600}}>{s.grades.fsd}</td>
                    <td style={{padding:'10px 12px', color:getGradeColor(s.grades.se), fontWeight:600}}>{s.grades.se}</td>
                    <td style={{padding:'10px 12px', color:getGradeColor(s.grades.cn), fontWeight:600}}>{s.grades.cn}</td>
                    <td style={{padding:'10px 12px', color:getGradeColor(s.grades.db), fontWeight:600}}>{s.grades.db}</td>
                    <td style={{padding:'10px 12px', color:s.overall.startsWith('A') ? '#22c55e' : '#fbbf24', fontWeight:600}}>{s.overall}</td>
                    <td style={{padding:'10px 12px'}}>{s.attendance}</td>
                    <td style={{padding:'10px 12px'}}>
                      <span className={getBehaviorClass(s.behavior)} style={{
                        padding:'4px 14px', borderRadius:16, fontSize:'0.95rem', fontWeight:500,
                        background: s.behavior === "Excellent" ? "#eafff2" : s.behavior === "Good" ? "#eaf2ff" : "#fef9c3",
                        color: s.behavior === "Excellent" ? "#22c55e" : s.behavior === "Good" ? "#6366f1" : "#fbbf24"
                      }}>
                        {s.behavior}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{display:'flex', gap:24, marginBottom:32}}>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontWeight:600, fontSize:'1.15rem', marginBottom:18}}>Behavior Reports
              <span style={{float:'right', color:'#6366f1', fontWeight:400, fontSize:'1rem', cursor:'pointer'}}>View All</span>
            </div>
            <ul style={{listStyle:'none', padding:0, margin:0}}>
              {behaviorList.map(b => (
                <li key={b.name} style={{display:'flex', alignItems:'center', marginBottom:18}}>
                  <span style={{
                    width:32, height:32, borderRadius:'50%', background:'#f3f3ff', color:'#444', fontWeight:600,
                    display:'flex', alignItems:'center', justifyContent:'center', marginRight:12, fontSize:'1rem'
                  }}>{b.initials}</span>
                  <span style={{flex:1}}>{b.name}</span>
                  <span className={getBehaviorClass(b.status)} style={{
                    padding:'4px 14px', borderRadius:16, fontSize:'0.95rem', fontWeight:500,
                    background: b.status === "Excellent" ? "#eafff2" : b.status === "Good" ? "#eaf2ff" : b.status === "Needs Improvement" ? "#fef9c3" : "#fee2e2",
                    color: b.status === "Excellent" ? "#22c55e" : b.status === "Good" ? "#6366f1" : b.status === "Needs Improvement" ? "#fbbf24" : "#b91c1c"
                  }}>
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{background:'#fff', borderRadius:16, padding:24, flex:1, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
            <div style={{fontWeight:600, fontSize:'1.15rem', marginBottom:18}}>Subject Performance
              <span style={{float:'right', color:'#6366f1', fontWeight:400, fontSize:'1rem', cursor:'pointer'}}>View Details</span>
            </div>
            <ul style={{listStyle:'none', padding:0, margin:0}}>
              {subjectPerformance.map(s => (
                <li key={s.name} style={{display:'flex', alignItems:'center', marginBottom:18}}>
                  <span style={{fontSize:'1.3rem', marginRight:14}}>{s.icon}</span>
                  <span style={{flex:1}}>{s.name}</span>
                  <span style={{fontWeight:500}}>{s.percent}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{background:'#fff', borderRadius:16, padding:24, marginBottom:32, boxShadow:'0 2px 8px rgba(80,80,160,0.08)'}}>
          <div style={{fontWeight:600, fontSize:'1.15rem', marginBottom:18}}>Academic Reports
            <span style={{float:'right', color:'#6366f1', fontWeight:400, fontSize:'1rem', cursor:'pointer'}}>Export Data</span>
          </div>
          <div style={{display:'flex', gap:24}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:500, marginBottom:8}}>Total Students</div>
              <div style={{fontSize:'2rem', fontWeight:600, color:'#2563eb'}}>180</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:500, marginBottom:8}}>Average Performance</div>
              <div style={{fontSize:'2rem', fontWeight:600, color:'#22c55e'}}>87%</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:500, marginBottom:8}}>Pending Reviews</div>
              <div style={{fontSize:'2rem', fontWeight:600, color:'#fbbf24'}}>12</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:500, marginBottom:8}}>At-Risk Students</div>
              <div style={{fontSize:'2rem', fontWeight:600, color:'#ef4444'}}>5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}