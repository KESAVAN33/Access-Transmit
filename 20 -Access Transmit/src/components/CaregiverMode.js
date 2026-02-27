/**
 * AccessTransit - Caregiver Mode Component
 * 
 * Allows family members/caregivers to:
 * - Track live location of elderly/disabled users
 * - Receive journey notifications
 * - Set geofence alerts
 * - View journey history
 * - Get alerts for unusual behavior
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Simulated tracked users (dependents)
const initialDependents = [
  {
    id: 1,
    name: 'Grandmother Lakshmi',
    avatar: '👵',
    phone: '+91 98765 43210',
    disabilityType: 'mobility',
    currentJourney: {
      active: true,
      route: 'Downtown Express',
      vehicle: 'Bus CBE-101',
      startTime: '09:30 AM',
      currentStop: 'City Hall',
      nextStop: 'Market Square',
      eta: '12 mins',
      progress: 40
    },
    location: { lat: 11.0168, lng: 76.9558 },
    lastUpdate: '2 mins ago',
    battery: 67,
    safeZones: ['Home', 'Temple', 'Hospital'],
    currentZone: 'In Transit'
  },
  {
    id: 2,
    name: 'Uncle Rajan',
    avatar: '👴',
    phone: '+91 87654 32109',
    disabilityType: 'visual',
    currentJourney: {
      active: false
    },
    location: { lat: 11.0245, lng: 76.9612 },
    lastUpdate: '15 mins ago',
    battery: 89,
    safeZones: ['Home', 'Park', 'Grocery Store'],
    currentZone: 'Home'
  }
];

// Simulated journey history
const journeyHistory = [
  {
    id: 1,
    dependentId: 1,
    date: 'Today',
    trips: [
      { from: 'Home', to: 'Temple', time: '06:00 AM', duration: '25 mins', status: 'completed' },
      { from: 'Temple', to: 'Home', time: '07:30 AM', duration: '22 mins', status: 'completed' },
      { from: 'Home', to: 'Market Square', time: '09:30 AM', duration: '-', status: 'ongoing' }
    ]
  },
  {
    id: 2,
    dependentId: 1,
    date: 'Yesterday',
    trips: [
      { from: 'Home', to: 'Hospital', time: '10:00 AM', duration: '35 mins', status: 'completed' },
      { from: 'Hospital', to: 'Home', time: '02:00 PM', duration: '40 mins', status: 'completed' }
    ]
  }
];

// Alert types
const alertTypes = [
  { id: 'departure', label: 'Departure from safe zone', enabled: true },
  { id: 'arrival', label: 'Arrival at destination', enabled: true },
  { id: 'delay', label: 'Journey delays (>10 mins)', enabled: true },
  { id: 'sos', label: 'SOS triggered', enabled: true },
  { id: 'battery', label: 'Low battery (<20%)', enabled: true },
  { id: 'fall', label: 'Fall detected', enabled: true },
  { id: 'unusual', label: 'Unusual route deviation', enabled: false }
];

function CaregiverMode() {
  const navigate = useNavigate();
  const [dependents, setDependents] = useState(initialDependents);
  const [selectedDependent, setSelectedDependent] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'map', 'history'
  const [alerts, setAlerts] = useState(alertTypes);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'journey', message: 'Grandmother started journey to Market Square', time: '09:30 AM', read: false },
    { id: 2, type: 'arrival', message: 'Uncle Rajan arrived at Home', time: '08:45 AM', read: true },
    { id: 3, type: 'battery', message: 'Grandmother\'s device battery at 67%', time: '09:15 AM', read: true }
  ]);
  const [showAddDependent, setShowAddDependent] = useState(false);
  const [newDependent, setNewDependent] = useState({ name: '', phone: '', disabilityType: '' });
  const [shareCode, setShareCode] = useState('');

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDependents(prev => prev.map(dep => {
        if (dep.currentJourney.active) {
          // Simulate progress
          const newProgress = Math.min(dep.currentJourney.progress + Math.random() * 5, 100);
          const newEta = Math.max(parseInt(dep.currentJourney.eta) - 1, 0);
          return {
            ...dep,
            currentJourney: {
              ...dep.currentJourney,
              progress: newProgress,
              eta: `${newEta} mins`
            },
            lastUpdate: 'Just now'
          };
        }
        return dep;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle alert setting
  const toggleAlert = (alertId) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, enabled: !a.enabled } : a
    ));
  };

  // Add new dependent (via invite code)
  const addDependent = () => {
    if (shareCode === 'ACCESS123') { // Simulated valid code
      const newDep = {
        id: Date.now(),
        name: newDependent.name || 'New Dependent',
        avatar: '👤',
        phone: newDependent.phone || 'Not provided',
        disabilityType: newDependent.disabilityType || 'none',
        currentJourney: { active: false },
        location: { lat: 11.0200, lng: 76.9600 },
        lastUpdate: 'Just added',
        battery: 100,
        safeZones: ['Home'],
        currentZone: 'Unknown'
      };
      setDependents(prev => [...prev, newDep]);
      setShowAddDependent(false);
      setShareCode('');
      setNewDependent({ name: '', phone: '', disabilityType: '' });
    }
  };

  // Generate share code (for dependent to share)
  const generateShareCode = () => {
    const code = 'AT' + Math.random().toString(36).substring(2, 8).toUpperCase();
    navigator.clipboard?.writeText(code);
    alert(`Share code generated: ${code}\nCopied to clipboard!`);
  };

  // Mark notification as read
  const markAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="caregiver-page">
      {/* Header */}
      <header className="caregiver-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>👨‍👩‍👧 Caregiver Mode</h1>
        <button 
          className="share-code-btn"
          onClick={generateShareCode}
          title="Generate invite code"
        >
          🔗 Share
        </button>
      </header>

      {/* View Toggle */}
      <div className="view-toggle">
        <button 
          className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
          onClick={() => setView('list')}
        >
          👥 Dependents
        </button>
        <button 
          className={`toggle-btn ${view === 'map' ? 'active' : ''}`}
          onClick={() => setView('map')}
        >
          🗺️ Live Map
        </button>
        <button 
          className={`toggle-btn ${view === 'history' ? 'active' : ''}`}
          onClick={() => setView('history')}
        >
          📜 History
        </button>
      </div>

      {/* Notifications Banner */}
      {notifications.filter(n => !n.read).length > 0 && (
        <div className="notifications-banner">
          <span className="notif-icon">🔔</span>
          <span className="notif-text">
            {notifications.filter(n => !n.read).length} new notifications
          </span>
          <button 
            className="view-all-btn"
            onClick={() => setView('notifications')}
          >
            View All
          </button>
        </div>
      )}

      {/* Main Content */}
      {view === 'list' && (
        <section className="dependents-section">
          <div className="section-header">
            <h2>Your Dependents</h2>
            <button 
              className="add-btn"
              onClick={() => setShowAddDependent(true)}
            >
              + Add
            </button>
          </div>

          {showAddDependent && (
            <div className="add-dependent-form">
              <h3>Link a Dependent</h3>
              <p className="form-desc">
                Ask your dependent to generate a share code from their AccessTransit app
              </p>
              <input 
                type="text"
                placeholder="Enter Share Code (e.g., ACCESS123)"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                className="share-code-input"
              />
              <input 
                type="text"
                placeholder="Dependent's Name"
                value={newDependent.name}
                onChange={(e) => setNewDependent({...newDependent, name: e.target.value})}
              />
              <select 
                value={newDependent.disabilityType}
                onChange={(e) => setNewDependent({...newDependent, disabilityType: e.target.value})}
              >
                <option value="">Accessibility Needs</option>
                <option value="mobility">Mobility Impaired</option>
                <option value="visual">Visual Impaired</option>
                <option value="hearing">Hearing Impaired</option>
                <option value="cognitive">Cognitive Support</option>
                <option value="elderly">Elderly Care</option>
              </select>
              <div className="form-actions">
                <button onClick={addDependent} className="link-btn">Link Dependent</button>
                <button onClick={() => setShowAddDependent(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          )}

          <div className="dependents-list">
            {dependents.map(dep => (
              <div 
                key={dep.id} 
                className={`dependent-card ${dep.currentJourney.active ? 'active-journey' : ''}`}
                onClick={() => setSelectedDependent(dep)}
              >
                <div className="dependent-avatar">{dep.avatar}</div>
                <div className="dependent-info">
                  <h3>{dep.name}</h3>
                  <span className={`zone-badge ${dep.currentZone === 'In Transit' ? 'transit' : 'safe'}`}>
                    📍 {dep.currentZone}
                  </span>
                  {dep.currentJourney.active && (
                    <div className="active-journey-info">
                      <span className="journey-route">🚌 {dep.currentJourney.route}</span>
                      <span className="journey-eta">ETA: {dep.currentJourney.eta}</span>
                      <div className="journey-progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${dep.currentJourney.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="dependent-status">
                  <span className={`battery-indicator ${dep.battery < 20 ? 'low' : ''}`}>
                    🔋 {dep.battery}%
                  </span>
                  <span className="last-update">Updated {dep.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === 'map' && (
        <section className="map-section">
          <div className="map-placeholder">
            <div className="map-overlay">
              <h3>🗺️ Live Location Map</h3>
              <p>Real-time tracking of all dependents</p>
              
              {/* Simulated map with markers */}
              <div className="simulated-map">
                {dependents.map(dep => (
                  <div 
                    key={dep.id}
                    className={`map-marker ${dep.currentJourney.active ? 'moving' : ''}`}
                    style={{
                      left: `${30 + dep.id * 20}%`,
                      top: `${40 + dep.id * 10}%`
                    }}
                  >
                    <span className="marker-avatar">{dep.avatar}</span>
                    <span className="marker-label">{dep.name.split(' ')[0]}</span>
                    {dep.currentJourney.active && (
                      <span className="marker-vehicle">🚌</span>
                    )}
                  </div>
                ))}
                
                {/* Safe zones */}
                <div className="safe-zone" style={{ left: '20%', top: '60%' }}>
                  🏠 Home
                </div>
                <div className="safe-zone" style={{ left: '70%', top: '30%' }}>
                  🏥 Hospital
                </div>
              </div>
            </div>
          </div>
          
          <div className="map-legend">
            <span className="legend-item"><span className="dot active"></span> In Transit</span>
            <span className="legend-item"><span className="dot safe"></span> In Safe Zone</span>
            <span className="legend-item"><span className="dot warning"></span> Outside Safe Zone</span>
          </div>
        </section>
      )}

      {view === 'history' && (
        <section className="history-section">
          <h2>Journey History</h2>
          {journeyHistory.map(day => (
            <div key={day.id} className="history-day">
              <h3 className="history-date">{day.date}</h3>
              <div className="trips-list">
                {day.trips.map((trip, idx) => (
                  <div key={idx} className={`trip-item ${trip.status}`}>
                    <div className="trip-time">{trip.time}</div>
                    <div className="trip-route">
                      <span className="from">{trip.from}</span>
                      <span className="arrow">→</span>
                      <span className="to">{trip.to}</span>
                    </div>
                    <div className="trip-duration">{trip.duration}</div>
                    <span className={`trip-status ${trip.status}`}>
                      {trip.status === 'completed' ? '✓' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {view === 'notifications' && (
        <section className="notifications-section">
          <h2>Notifications</h2>
          <div className="notifications-list">
            {notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(notif.id)}
              >
                <span className="notif-type-icon">
                  {notif.type === 'journey' ? '🚌' : 
                   notif.type === 'arrival' ? '📍' : 
                   notif.type === 'battery' ? '🔋' : '🔔'}
                </span>
                <div className="notif-content">
                  <p>{notif.message}</p>
                  <span className="notif-time">{notif.time}</span>
                </div>
                {!notif.read && <span className="unread-dot"></span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Alert Settings */}
      <section className="alert-settings">
        <h2>Alert Preferences</h2>
        <div className="alerts-list">
          {alerts.map(alert => (
            <label key={alert.id} className="alert-toggle">
              <span>{alert.label}</span>
              <input 
                type="checkbox"
                checked={alert.enabled}
                onChange={() => toggleAlert(alert.id)}
              />
              <span className="toggle-slider"></span>
            </label>
          ))}
        </div>
      </section>

      {/* Selected Dependent Detail Modal */}
      {selectedDependent && (
        <div className="dependent-modal-overlay" onClick={() => setSelectedDependent(null)}>
          <div className="dependent-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedDependent(null)}>✕</button>
            
            <div className="modal-header">
              <span className="modal-avatar">{selectedDependent.avatar}</span>
              <h2>{selectedDependent.name}</h2>
            </div>

            <div className="modal-content">
              <div className="info-row">
                <span className="label">Phone:</span>
                <span>{selectedDependent.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Accessibility:</span>
                <span className="disability-badge">{selectedDependent.disabilityType}</span>
              </div>
              <div className="info-row">
                <span className="label">Current Zone:</span>
                <span className={`zone ${selectedDependent.currentZone === 'Home' ? 'safe' : 'transit'}`}>
                  {selectedDependent.currentZone}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Battery:</span>
                <span>🔋 {selectedDependent.battery}%</span>
              </div>
              <div className="info-row">
                <span className="label">Safe Zones:</span>
                <div className="safe-zones-list">
                  {selectedDependent.safeZones.map((zone, idx) => (
                    <span key={idx} className="safe-zone-chip">{zone}</span>
                  ))}
                </div>
              </div>

              {selectedDependent.currentJourney.active && (
                <div className="current-journey-detail">
                  <h3>Active Journey</h3>
                  <p><strong>Route:</strong> {selectedDependent.currentJourney.route}</p>
                  <p><strong>Vehicle:</strong> {selectedDependent.currentJourney.vehicle}</p>
                  <p><strong>Current Stop:</strong> {selectedDependent.currentJourney.currentStop}</p>
                  <p><strong>Next Stop:</strong> {selectedDependent.currentJourney.nextStop}</p>
                  <p><strong>ETA:</strong> {selectedDependent.currentJourney.eta}</p>
                </div>
              )}

              <div className="modal-actions">
                <a href={`tel:${selectedDependent.phone}`} className="action-btn call">
                  📞 Call
                </a>
                <button className="action-btn message">
                  💬 Message
                </button>
                <button className="action-btn directions">
                  🧭 Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaregiverMode;
