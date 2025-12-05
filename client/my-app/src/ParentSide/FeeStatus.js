// FeeStatus.js
import React from 'react';
import './FeeStatus.css';

function FeeStatus({ embedded }) {
  const content = (
    <>
      <header className="parent-header">
        <div>
          <h2>Fee Status & Payments</h2>
          <span className="parent-welcome">Manage and track fee payments</span>
        </div>
      </header>
      
      <section className="fee-section">
        <div className="fee-summary">
          <div className="fee-summary-card paid">
            <div className="fee-icon">💰</div>
            <div className="fee-content">
              <div className="fee-amount">₹85,000</div>
              <div className="fee-label">Total Paid (2024-25)</div>
            </div>
          </div>
          <div className="fee-summary-card pending">
            <div className="fee-icon">⏳</div>
            <div className="fee-content">
              <div className="fee-amount">₹15,000</div>
              <div className="fee-label">Pending Payment</div>
            </div>
          </div>
          <div className="fee-summary-card due">
            <div className="fee-icon">📅</div>
            <div className="fee-content">
              <div className="fee-date">Jan 25, 2025</div>
              <div className="fee-label">Next Due Date</div>
            </div>
          </div>
        </div>
        
        <div className="fee-details">
          <h3>Fee Breakdown - Academic Year 2024-25</h3>
          <div className="fee-table-container">
            <table className="fee-table">
              <thead>
                <tr>
                  <th>Fee Type</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tuition Fee - Sem 3</td>
                  <td>₹25,000</td>
                  <td>Aug 15, 2024</td>
                  <td><span className="status-paid">Paid</span></td>
                  <td>Aug 10, 2024</td>
                  <td><button className="receipt-btn">📄 Download</button></td>
                </tr>
                <tr>
                  <td>Development Fee</td>
                  <td>₹10,000</td>
                  <td>Sep 30, 2024</td>
                  <td><span className="status-paid">Paid</span></td>
                  <td>Sep 25, 2024</td>
                  <td><button className="receipt-btn">📄 Download</button></td>
                </tr>
                <tr>
                  <td>Tuition Fee - Sem 4</td>
                  <td>₹25,000</td>
                  <td>Jan 15, 2025</td>
                  <td><span className="status-paid">Paid</span></td>
                  <td>Jan 12, 2025</td>
                  <td><button className="receipt-btn">📄 Download</button></td>
                </tr>
                <tr>
                  <td>Examination Fee</td>
                  <td>₹5,000</td>
                  <td>Jan 25, 2025</td>
                  <td><span className="status-pending">Pending</span></td>
                  <td>-</td>
                  <td><button className="pay-btn">💳 Pay Now</button></td>
                </tr>
                <tr>
                  <td>Library Fee</td>
                  <td>₹2,000</td>
                  <td>Jan 25, 2025</td>
                  <td><span className="status-pending">Pending</span></td>
                  <td>-</td>
                  <td><button className="pay-btn">💳 Pay Now</button></td>
                </tr>
                <tr>
                  <td>Laboratory Fee</td>
                  <td>₹8,000</td>
                  <td>Jan 25, 2025</td>
                  <td><span className="status-pending">Pending</span></td>
                  <td>-</td>
                  <td><button className="pay-btn">💳 Pay Now</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="payment-methods">
          <h3>Payment Methods</h3>
          <div className="payment-options">
            <div className="payment-option">
              <div className="payment-icon">🏦</div>
              <span>Net Banking</span>
            </div>
            <div className="payment-option">
              <div className="payment-icon">💳</div>
              <span>Credit/Debit Card</span>
            </div>
            <div className="payment-option">
              <div className="payment-icon">📱</div>
              <span>UPI Payment</span>
            </div>
            <div className="payment-option">
              <div className="payment-icon">💰</div>
              <span>Wallet</span>
            </div>
          </div>
        </div>
        
        <div className="fee-reminders">
          <h3>Important Reminders</h3>
          <div className="reminder-list">
            <div className="reminder-item">
              <div className="reminder-icon">⚠️</div>
              <div className="reminder-content">
                <div className="reminder-title">Pending Payment Alert</div>
                <div className="reminder-desc">₹15,000 due on January 25, 2025. Late payment may attract penalty.</div>
              </div>
            </div>
            <div className="reminder-item">
              <div className="reminder-icon">ℹ️</div>
              <div className="reminder-content">
                <div className="reminder-title">Fee Concession</div>
                <div className="reminder-desc">Apply for fee concession before January 20, 2025 if eligible.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );

  if (embedded) {
    return content;
  }

  return <div className="parent-main">{content}</div>;
}

export default FeeStatus;