/**
 * AccessTransit - Buddy Connect
 * 
 * Connects travelers who need assistance with volunteers.
 * Real-time matching for accessible travel support.
 */
import React, { useState, useEffect } from 'react';

const nearbyBuddies = [
  {
    id: 1,
    name: 'Arjun K.',
    avatar: '👨',
    distance: '0.3 km',
    rating: 4.9,
    trips: 56,
    badges: ['Wheelchair Expert', 'Regular Volunteer'],
    available: true,
    specialties: ['wheelchair', 'elderly']
  },
  {
    id: 2,
    name: 'Meera S.',
    avatar: '👩',
    distance: '0.5 km',
    rating: 4.8,
    trips: 42,
    badges: ['Visual Guide', 'Metro Expert'],
    available: true,
    specialties: ['visual', 'cognitive']
  },
  {
    id: 3,
    name: 'Ravi P.',
    avatar: '👨',
    distance: '0.8 km',
    rating: 4.7,
    trips: 38,
    badges: ['Hearing Support'],
    available: false,
    lastActive: '20 min ago',
    specialties: ['hearing']
  }
];

const upcomingTrips = [
  {
    id: 1,
    buddy: 'Arjun K.',
    avatar: '👨',
    date: 'Tomorrow, 9:00 AM',
    route: 'Home → Central Station',
    status: 'confirmed'
  }
];

const pastTrips = [
  { id: 1, buddy: 'Meera S.', date: 'Feb 24, 2026', route: 'Central → RS Puram', rating: 5 },
  { id: 2, buddy: 'Arjun K.', date: 'Feb 20, 2026', route: 'Home → Hospital', rating: 5 },
  { id: 3, buddy: 'Kavitha R.', date: 'Feb 15, 2026', route: 'Mall → Home', rating: 4 }
];

function BuddyConnect() {
  const [activeTab, setActiveTab] = useState('find');
  const [searching, setSearching] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [tripDetails, setTripDetails] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    needType: 'wheelchair'
  });

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 2000);
  };

  return (
    <div className="buddy-connect-page">
      {/* Header */}
      <div className="buddy-header">
        <div className="buddy-icon-container">
          <span className="buddy-main-icon">🤝</span>
          <span className="heart-pulse">💚</span>
        </div>
        <h1>Buddy Connect</h1>
        <p>Find travel companions for accessible journeys</p>
      </div>

      {/* Quick Stats */}
      <div className="buddy-stats">
        <div className="buddy-stat">
          <span className="bs-value">{nearbyBuddies.filter(b => b.available).length}</span>
          <span className="bs-label">Available Now</span>
        </div>
        <div className="buddy-stat">
          <span className="bs-value">{upcomingTrips.length}</span>
          <span className="bs-label">Scheduled</span>
        </div>
        <div className="buddy-stat">
          <span className="bs-value">{pastTrips.length}</span>
          <span className="bs-label">Completed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="buddy-tabs">
        {['find', 'scheduled', 'history'].map(tab => (
          <button
            key={tab}
            className={`buddy-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'find' && '🔍'}
            {tab === 'scheduled' && '📅'}
            {tab === 'history' && '📜'}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="buddy-content">
        {activeTab === 'find' && (
          <>
            {/* Request Form */}
            <div className="request-form-card">
              <h3>📍 Plan Your Journey</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>From</label>
                  <input 
                    type="text" 
                    placeholder="Start location"
                    value={tripDetails.from}
                    onChange={(e) => setTripDetails({...tripDetails, from: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>To</label>
                  <input 
                    type="text" 
                    placeholder="Destination"
                    value={tripDetails.to}
                    onChange={(e) => setTripDetails({...tripDetails, to: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date"
                    value={tripDetails.date}
                    onChange={(e) => setTripDetails({...tripDetails, date: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time"
                    value={tripDetails.time}
                    onChange={(e) => setTripDetails({...tripDetails, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group full-width">
                <label>Assistance Type</label>
                <select 
                  value={tripDetails.needType}
                  onChange={(e) => setTripDetails({...tripDetails, needType: e.target.value})}
                >
                  <option value="wheelchair">♿ Wheelchair Assistance</option>
                  <option value="visual">👁️ Visual Guidance</option>
                  <option value="hearing">👂 Hearing Support</option>
                  <option value="elderly">👴 Elderly Support</option>
                  <option value="cognitive">🧠 Cognitive Support</option>
                </select>
              </div>
              <button className="find-buddy-btn" onClick={handleSearch}>
                {searching ? (
                  <>
                    <span className="spinner"></span>
                    Finding Buddies...
                  </>
                ) : (
                  <>🔍 Find Available Buddies</>
                )}
              </button>
            </div>

            {/* Nearby Buddies */}
            <div className="section-card">
              <h3>👥 Nearby Buddies</h3>
              <div className="buddies-list">
                {nearbyBuddies.map(buddy => (
                  <div 
                    key={buddy.id} 
                    className={`buddy-card ${!buddy.available ? 'unavailable' : ''}`}
                    onClick={() => buddy.available && setSelectedBuddy(buddy)}
                  >
                    <div className="buddy-avatar-section">
                      <span className="buddy-avatar">{buddy.avatar}</span>
                      <span className={`status-dot ${buddy.available ? 'online' : 'offline'}`}></span>
                    </div>
                    <div className="buddy-info">
                      <h4>{buddy.name}</h4>
                      <div className="buddy-meta">
                        <span className="rating">⭐ {buddy.rating}</span>
                        <span className="trips">{buddy.trips} trips</span>
                        <span className="distance">📍 {buddy.distance}</span>
                      </div>
                      <div className="buddy-badges">
                        {buddy.badges.slice(0, 2).map((badge, i) => (
                          <span key={i} className="mini-badge">{badge}</span>
                        ))}
                      </div>
                    </div>
                    {buddy.available ? (
                      <button className="connect-btn">Connect</button>
                    ) : (
                      <span className="last-active">{buddy.lastActive}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Features */}
            <div className="safety-card">
              <h3>🛡️ Safety Features</h3>
              <div className="safety-features">
                <div className="safety-item">
                  <span className="safety-icon">✅</span>
                  <span>All buddies are verified</span>
                </div>
                <div className="safety-item">
                  <span className="safety-icon">📍</span>
                  <span>Real-time location sharing</span>
                </div>
                <div className="safety-item">
                  <span className="safety-icon">🆘</span>
                  <span>SOS button always available</span>
                </div>
                <div className="safety-item">
                  <span className="safety-icon">⭐</span>
                  <span>Rating & review system</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'scheduled' && (
          <div className="scheduled-section">
            {upcomingTrips.length > 0 ? (
              <>
                <h3>📅 Upcoming Trips</h3>
                {upcomingTrips.map(trip => (
                  <div key={trip.id} className="scheduled-card">
                    <div className="scheduled-header">
                      <span className="sc-avatar">{trip.avatar}</span>
                      <div className="sc-info">
                        <h4>{trip.buddy}</h4>
                        <span className="sc-date">{trip.date}</span>
                      </div>
                      <span className={`sc-status ${trip.status}`}>
                        {trip.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="sc-route">
                      <span className="route-icon">🗺️</span>
                      <span>{trip.route}</span>
                    </div>
                    <div className="sc-actions">
                      <button className="sc-btn message">💬 Message</button>
                      <button className="sc-btn cancel">Cancel</button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📅</span>
                <h3>No Scheduled Trips</h3>
                <p>Find a buddy to schedule your next accessible journey</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <h3>📜 Trip History</h3>
            {pastTrips.map(trip => (
              <div key={trip.id} className="history-card">
                <div className="history-info">
                  <h4>{trip.buddy}</h4>
                  <span className="history-date">{trip.date}</span>
                  <span className="history-route">{trip.route}</span>
                </div>
                <div className="history-rating">
                  {[...Array(trip.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buddy Detail Modal */}
      {selectedBuddy && (
        <div className="modal-overlay" onClick={() => setSelectedBuddy(null)}>
          <div className="buddy-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedBuddy(null)}>✕</button>
            <div className="modal-buddy-header">
              <span className="modal-avatar">{selectedBuddy.avatar}</span>
              <h2>{selectedBuddy.name}</h2>
              <div className="modal-stats">
                <span>⭐ {selectedBuddy.rating}</span>
                <span>🤝 {selectedBuddy.trips} trips</span>
              </div>
            </div>
            <div className="modal-badges">
              {selectedBuddy.badges.map((badge, i) => (
                <span key={i} className="modal-badge">{badge}</span>
              ))}
            </div>
            <div className="modal-specialties">
              <h4>Specialties</h4>
              <div className="specialty-icons">
                {selectedBuddy.specialties.includes('wheelchair') && <span>♿</span>}
                {selectedBuddy.specialties.includes('visual') && <span>👁️</span>}
                {selectedBuddy.specialties.includes('hearing') && <span>👂</span>}
                {selectedBuddy.specialties.includes('elderly') && <span>👴</span>}
                {selectedBuddy.specialties.includes('cognitive') && <span>🧠</span>}
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-btn primary">🤝 Request Buddy</button>
              <button className="modal-btn secondary">💬 Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuddyConnect;
