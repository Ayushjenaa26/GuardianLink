// MarksKTs.js
import React from 'react';
import './ParentDashboard.css';

function MarksKTs({ onSignOut }) {
  return (
    <div className="parent-layout">
      <aside className="parent-sidebar">
        <div className="parent-logo">
          <img src="/logo192.png" alt="GuardianLink" />
          <span>GuardianLink</span>
        </div>
        <div className="parent-role">
          <span className="parent-role-badge">parent</span>
          <span>Marks & KTs</span>
        </div>
        <div className="parent-powered">
          by <a href="https://edutrackers.com" target="_blank" rel="noopener noreferrer">EduTrackers</a>
        </div>
        <nav className="parent-nav">
          <button onClick={() => {}} aria-label="Go to Dashboard">Dashboard</button>
          <button onClick={() => {}} aria-label="Go to Notifications">Notifications</button>
          <button onClick={() => {}} aria-label="Go to Reports">Reports</button>
          <button onClick={() => {}} aria-label="Go to Attendance">Attendance</button>
          <button className="active" onClick={() => {}} aria-label="Current Marks">Marks & KTs</button>
          <button onClick={() => {}} aria-label="Go to Fee Status">Fee Status</button>
          <button onClick={() => {}} aria-label="Go to Behavior">Behavior</button>
        </nav>
        <div className="parent-user">
          <div className="parent-avatar">👤</div>
          <div>
            <div>Parent User</div>
            <div className="parent-user-role">Parent</div>
            <div className="parent-user-id">CS-2025-001</div>
          </div>
        </div>
        <button className="parent-signout" onClick={onSignOut}>↩ Sign Out</button>
      </aside>
      <main className="parent-main">
        <header className="parent-header">
          <div>
            <h2>Marks & KT Status</h2>
            <span className="parent-welcome">Academic performance and backlog tracking</span>
          </div>
          <div className="parent-notifications">
            <span>🔔 Notifications</span>
            <span className="parent-notif-count">3</span>
          </div>
        </header>
        
        <section className="marks-section">
          <div className="semester-selector">
            <h3>Semester 4 Results</h3>
            <select className="semester-dropdown">
              <option>Semester 4 (Current)</option>
              <option>Semester 3</option>
              <option>Semester 2</option>
              <option>Semester 1</option>
            </select>
          </div>
          
          <div className="marks-overview">
            <div className="overview-card">
              <div className="overview-title">SGPA</div>
              <div className="overview-value">8.75</div>
              <div className="overview-trend">↑ +0.25 from last sem</div>
            </div>
            <div className="overview-card">
              <div className="overview-title">CGPA</div>
              <div className="overview-value">8.50</div>
              <div className="overview-trend">Consistent</div>
            </div>
            <div className="overview-card">
              <div className="overview-title">Active KTs</div>
              <div className="overview-value">0</div>
              <div className="overview-trend">All clear</div>
            </div>
            <div className="overview-card">
              <div className="overview-title">Class Rank</div>
              <div className="overview-value">12</div>
              <div className="overview-trend">Top 20%</div>
            </div>
          </div>
          
          <div className="marks-table-container">
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Internal 1</th>
                  <th>Internal 2</th>
                  <th>Assignment</th>
                  <th>Practical</th>
                  <th>Final Exam</th>
                  <th>Total</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Software Engineering</td>
                  <td>18/20</td>
                  <td>19/20</td>
                  <td>24/25</td>
                  <td>28/30</td>
                  <td>75/100</td>
                  <td>164/195</td>
                  <td className="grade-a">A</td>
                </tr>
                <tr>
                  <td>Computer Networks</td>
                  <td>16/20</td>
                  <td>17/20</td>
                  <td>22/25</td>
                  <td>26/30</td>
                  <td>68/100</td>
                  <td>149/195</td>
                  <td className="grade-b-plus">B+</td>
                </tr>
                <tr>
                  <td>Database Systems</td>
                  <td>17/20</td>
                  <td>18/20</td>
                  <td>23/25</td>
                  <td>27/30</td>
                  <td>72/100</td>
                  <td>157/195</td>
                  <td className="grade-a-minus">A-</td>
                </tr>
                <tr>
                  <td>Web Development</td>
                  <td>19/20</td>
                  <td>20/20</td>
                  <td>25/25</td>
                  <td>29/30</td>
                  <td>78/100</td>
                  <td>171/195</td>
                  <td className="grade-a">A</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="kt-status">
            <h3>KT (Backlog) Status</h3>
            <div className="kt-cards">
              <div className="kt-card no-kt">
                <div className="kt-icon">✅</div>
                <div className="kt-content">
                  <div className="kt-title">No Active KTs</div>
                  <div className="kt-desc">All subjects cleared successfully</div>
                </div>
              </div>
              <div className="kt-card cleared-kt">
                <div className="kt-icon">📚</div>
                <div className="kt-content">
                  <div className="kt-title">Cleared KTs</div>
                  <div className="kt-desc">2 subjects cleared in previous semesters</div>
                  <div className="kt-details">
                    <span>Data Structures (Sem 2)</span>
                    <span>Mathematics (Sem 1)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MarksKTs;