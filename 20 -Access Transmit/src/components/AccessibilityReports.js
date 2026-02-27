/**
 * AccessTransit - Accessibility Reports Component
 * 
 * Crowd-sourced accessibility reporting system:
 * - Report broken elevators, escalators, ramps
 * - Flag accessibility issues in real-time
 * - Rate station/stop accessibility
 * - View reports from other users
 * - Official response tracking
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Issue categories
const issueCategories = [
  { id: 'elevator', icon: '🛗', label: 'Elevator', issues: ['Not Working', 'Being Serviced', 'Slow', 'Full'] },
  { id: 'escalator', icon: '📶', label: 'Escalator', issues: ['Not Working', 'Being Serviced', 'Wrong Direction'] },
  { id: 'ramp', icon: '♿', label: 'Ramp', issues: ['Blocked', 'Damaged', 'Too Steep', 'Slippery'] },
  { id: 'toilet', icon: '🚻', label: 'Accessible Toilet', issues: ['Not Working', 'Locked', 'Occupied Long Time', 'Not Clean'] },
  { id: 'tactile', icon: '🦯', label: 'Tactile Path', issues: ['Damaged', 'Blocked', 'Missing', 'Confusing'] },
  { id: 'audio', icon: '🔊', label: 'Audio Announcements', issues: ['Not Working', 'Too Quiet', 'Wrong Info'] },
  { id: 'signage', icon: '🪧', label: 'Signage', issues: ['Missing', 'Damaged', 'Not Visible', 'Confusing'] },
  { id: 'seating', icon: '💺', label: 'Priority Seating', issues: ['Occupied', 'Damaged', 'Missing'] }
];

// Simulated existing reports
const initialReports = [
  {
    id: 1,
    category: 'elevator',
    issue: 'Not Working',
    location: 'Central Station - Platform 2',
    city: 'Chennai',
    description: 'Elevator stuck on ground floor. Out of service sign posted.',
    reportedBy: 'User123',
    timestamp: '2 hours ago',
    upvotes: 15,
    verified: true,
    status: 'confirmed',
    officialResponse: 'Technician dispatched. Expected repair by 4 PM.',
    photos: 1
  },
  {
    id: 2,
    category: 'ramp',
    issue: 'Blocked',
    location: 'City Hall Bus Stop',
    city: 'Coimbatore',
    description: 'Ramp blocked by parked bikes. Unable to access.',
    reportedBy: 'User456',
    timestamp: '30 mins ago',
    upvotes: 8,
    verified: false,
    status: 'pending',
    officialResponse: null,
    photos: 2
  },
  {
    id: 3,
    category: 'toilet',
    issue: 'Not Working',
    location: 'Gandhipuram Bus Terminal',
    city: 'Coimbatore',
    description: 'Accessible toilet water supply issue.',
    reportedBy: 'User789',
    timestamp: '1 day ago',
    upvotes: 23,
    verified: true,
    status: 'resolved',
    officialResponse: 'Issue fixed on 25 Feb.',
    photos: 0
  },
  {
    id: 4,
    category: 'audio',
    issue: 'Not Working',
    location: 'T Nagar Metro Station',
    city: 'Chennai',
    description: 'Audio announcements not working on southbound platform.',
    reportedBy: 'User234',
    timestamp: '3 hours ago',
    upvotes: 12,
    verified: true,
    status: 'confirmed',
    officialResponse: 'Under investigation.',
    photos: 0
  }
];

// City list
const cities = ['All Cities', 'Coimbatore', 'Chennai', 'Erode', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Kolkata'];

function AccessibilityReports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(initialReports);
  const [filterCity, setFilterCity] = useState('All Cities');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewReport, setShowNewReport] = useState(false);
  const [newReport, setNewReport] = useState({
    category: '',
    issue: '',
    location: '',
    city: 'Coimbatore',
    description: ''
  });
  const [sortBy, setSortBy] = useState('recent');
  const [selectedReport, setSelectedReport] = useState(null);
  const [userVotes, setUserVotes] = useState(new Set());

  // Filter and sort reports
  const filteredReports = reports
    .filter(r => filterCity === 'All Cities' || r.city === filterCity)
    .filter(r => filterCategory === 'all' || r.category === filterCategory)
    .filter(r => filterStatus === 'all' || r.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'recent') return 0; // Already sorted by time
      if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
      return 0;
    });

  // Submit new report
  const submitReport = () => {
    if (!newReport.category || !newReport.issue || !newReport.location) {
      alert('Please fill all required fields');
      return;
    }

    const report = {
      id: Date.now(),
      ...newReport,
      reportedBy: 'You',
      timestamp: 'Just now',
      upvotes: 0,
      verified: false,
      status: 'pending',
      officialResponse: null,
      photos: 0
    };

    setReports(prev => [report, ...prev]);
    setShowNewReport(false);
    setNewReport({
      category: '',
      issue: '',
      location: '',
      city: 'Coimbatore',
      description: ''
    });
  };

  // Upvote report
  const upvoteReport = (reportId) => {
    if (userVotes.has(reportId)) return;
    
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r
    ));
    setUserVotes(prev => new Set([...prev, reportId]));
  };

  // Get category info
  const getCategoryInfo = (categoryId) => {
    return issueCategories.find(c => c.id === categoryId) || { icon: '❓', label: 'Other' };
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'confirmed': return 'status-confirmed';
      case 'resolved': return 'status-resolved';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="accessibility-reports-page">
      {/* Header */}
      <header className="reports-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>♿ Accessibility Reports</h1>
        <button 
          className="new-report-btn"
          onClick={() => setShowNewReport(true)}
        >
          + Report
        </button>
      </header>

      {/* Stats Banner */}
      <div className="reports-stats">
        <div className="stat-item">
          <span className="stat-value">{reports.length}</span>
          <span className="stat-label">Total Reports</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{reports.filter(r => r.status === 'confirmed').length}</span>
          <span className="stat-label">Active Issues</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{reports.filter(r => r.status === 'resolved').length}</span>
          <span className="stat-label">Resolved</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">92%</span>
          <span className="stat-label">Response Rate</span>
        </div>
      </div>

      {/* Filters */}
      <div className="reports-filters">
        <select 
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="filter-select"
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        
        <select 
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {issueCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
          ))}
        </select>

        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="confirmed">✓ Confirmed</option>
          <option value="resolved">✅ Resolved</option>
        </select>

        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="recent">Most Recent</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
      </div>

      {/* Quick Category Buttons */}
      <div className="category-quick-filter">
        {issueCategories.slice(0, 5).map(cat => (
          <button 
            key={cat.id}
            className={`category-btn ${filterCategory === cat.id ? 'active' : ''}`}
            onClick={() => setFilterCategory(filterCategory === cat.id ? 'all' : cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-label">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Reports List */}
      <section className="reports-list">
        {filteredReports.length === 0 ? (
          <div className="no-reports">
            <span className="no-reports-icon">✅</span>
            <p>No accessibility issues reported in this area!</p>
            <p className="subtext">Be the first to report if you find any issue.</p>
          </div>
        ) : (
          filteredReports.map(report => {
            const catInfo = getCategoryInfo(report.category);
            return (
              <div 
                key={report.id} 
                className={`report-card ${getStatusClass(report.status)}`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="report-category-badge">
                  <span className="badge-icon">{catInfo.icon}</span>
                  <span className="badge-label">{catInfo.label}</span>
                </div>
                
                <div className="report-main">
                  <h3 className="report-issue">{report.issue}</h3>
                  <p className="report-location">📍 {report.location}</p>
                  <p className="report-city">{report.city}</p>
                  {report.description && (
                    <p className="report-description">{report.description}</p>
                  )}
                </div>

                <div className="report-meta">
                  <span className="report-time">🕐 {report.timestamp}</span>
                  {report.verified && <span className="verified-badge">✓ Verified</span>}
                  {report.photos > 0 && <span className="photos-badge">📷 {report.photos}</span>}
                </div>

                <div className="report-status-badge">
                  {report.status === 'pending' && <span className="pending">⏳ Pending Review</span>}
                  {report.status === 'confirmed' && <span className="confirmed">⚠️ Confirmed Issue</span>}
                  {report.status === 'resolved' && <span className="resolved">✅ Resolved</span>}
                </div>

                {report.officialResponse && (
                  <div className="official-response">
                    <span className="response-label">🏛️ Official Response:</span>
                    <p>{report.officialResponse}</p>
                  </div>
                )}

                <div className="report-actions">
                  <button 
                    className={`upvote-btn ${userVotes.has(report.id) ? 'voted' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      upvoteReport(report.id);
                    }}
                  >
                    👍 {report.upvotes}
                  </button>
                  <button className="share-btn" onClick={(e) => e.stopPropagation()}>
                    📤 Share
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* New Report Modal */}
      {showNewReport && (
        <div className="modal-overlay" onClick={() => setShowNewReport(false)}>
          <div className="new-report-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowNewReport(false)}>✕</button>
            <h2>Report Accessibility Issue</h2>
            
            <div className="form-group">
              <label>Issue Category *</label>
              <div className="category-grid">
                {issueCategories.map(cat => (
                  <button 
                    key={cat.id}
                    type="button"
                    className={`category-option ${newReport.category === cat.id ? 'selected' : ''}`}
                    onClick={() => setNewReport({...newReport, category: cat.id, issue: ''})}
                  >
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-name">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {newReport.category && (
              <div className="form-group">
                <label>Specific Issue *</label>
                <div className="issues-list">
                  {issueCategories.find(c => c.id === newReport.category)?.issues.map(issue => (
                    <button 
                      key={issue}
                      type="button"
                      className={`issue-option ${newReport.issue === issue ? 'selected' : ''}`}
                      onClick={() => setNewReport({...newReport, issue})}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>City *</label>
              <select 
                value={newReport.city}
                onChange={(e) => setNewReport({...newReport, city: e.target.value})}
              >
                {cities.filter(c => c !== 'All Cities').map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input 
                type="text"
                placeholder="e.g., Central Station - Platform 2"
                value={newReport.location}
                onChange={(e) => setNewReport({...newReport, location: e.target.value})}
              />
              <button className="use-current-location" type="button">
                📍 Use Current Location
              </button>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea 
                placeholder="Describe the issue in detail..."
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Add Photos</label>
              <button className="add-photo-btn" type="button">
                📷 Take Photo / Upload
              </button>
            </div>

            <div className="form-actions">
              <button 
                className="submit-btn"
                onClick={submitReport}
              >
                Submit Report
              </button>
              <button 
                className="cancel-btn"
                onClick={() => setShowNewReport(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="report-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedReport(null)}>✕</button>
            
            <div className="detail-header">
              <span className="detail-icon">{getCategoryInfo(selectedReport.category).icon}</span>
              <div>
                <h2>{selectedReport.issue}</h2>
                <p className="detail-category">{getCategoryInfo(selectedReport.category).label}</p>
              </div>
            </div>

            <div className="detail-content">
              <div className="detail-row">
                <span className="label">📍 Location:</span>
                <span>{selectedReport.location}</span>
              </div>
              <div className="detail-row">
                <span className="label">🏙️ City:</span>
                <span>{selectedReport.city}</span>
              </div>
              <div className="detail-row">
                <span className="label">🕐 Reported:</span>
                <span>{selectedReport.timestamp} by {selectedReport.reportedBy}</span>
              </div>
              <div className="detail-row">
                <span className="label">📊 Status:</span>
                <span className={`status-badge ${selectedReport.status}`}>
                  {selectedReport.status}
                </span>
              </div>

              {selectedReport.description && (
                <div className="detail-description">
                  <h4>Description:</h4>
                  <p>{selectedReport.description}</p>
                </div>
              )}

              {selectedReport.officialResponse && (
                <div className="detail-official-response">
                  <h4>🏛️ Official Response:</h4>
                  <p>{selectedReport.officialResponse}</p>
                </div>
              )}

              <div className="detail-actions">
                <button 
                  className={`upvote-btn large ${userVotes.has(selectedReport.id) ? 'voted' : ''}`}
                  onClick={() => upvoteReport(selectedReport.id)}
                >
                  👍 Confirm Issue ({selectedReport.upvotes})
                </button>
                <button className="directions-btn">
                  🧭 Get Directions
                </button>
                <button className="share-btn">
                  📤 Share Report
                </button>
              </div>

              <div className="alternative-routes">
                <h4>Alternative Routes:</h4>
                <p className="suggestion">
                  🚌 Take Route 5 which has working elevator access
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccessibilityReports;
