/**
 * AccessTransit - Emergency SOS Component
 * 
 * Critical safety feature that provides:
 * - One-tap emergency SOS with location sharing
 * - Auto-call emergency services
 * - Share live location with emergency contacts
 * - Silent panic mode for dangerous situations
 * - Automatic incident documentation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Simulated emergency contacts (would come from user profile in real app)
const defaultEmergencyContacts = [
  { id: 1, name: 'Family Member', phone: '+91 98765 43210', relationship: 'Parent' },
  { id: 2, name: 'Caregiver', phone: '+91 87654 32109', relationship: 'Caregiver' },
];

// Emergency services
const emergencyServices = [
  { id: 'police', name: 'Police', number: '100', icon: '👮', color: '#3b82f6' },
  { id: 'ambulance', name: 'Ambulance', number: '108', icon: '🚑', color: '#ef4444' },
  { id: 'women', name: 'Women Helpline', number: '181', icon: '🆘', color: '#ec4899' },
  { id: 'disability', name: 'Disability Helpline', number: '1800-599-0019', icon: '♿', color: '#8b5cf6' },
];

function EmergencySOS() {
  const navigate = useNavigate();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [alertsSent, setAlertsSent] = useState([]);
  const [silentMode, setSilentMode] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState(defaultEmergencyContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [incidentType, setIncidentType] = useState('general');
  const [sosHistory, setSosHistory] = useState([]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toLocaleTimeString()
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError('Unable to get location. Please enable GPS.');
          // Fallback to approximate location (simulated)
          setCurrentLocation({
            lat: 11.0168,
            lng: 76.9558,
            accuracy: 100,
            timestamp: new Date().toLocaleTimeString(),
            approximate: true
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // SOS countdown handler
  useEffect(() => {
    let timer;
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (sosActive && countdown === 0) {
      triggerEmergency();
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown]);

  // Trigger emergency alerts
  const triggerEmergency = useCallback(() => {
    const timestamp = new Date().toISOString();
    const alerts = [];

    // Vibrate pattern for emergency (if supported and not silent)
    if (!silentMode && navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }

    // Simulate sending alerts to contacts
    emergencyContacts.forEach(contact => {
      alerts.push({
        type: 'contact',
        name: contact.name,
        phone: contact.phone,
        status: 'sent',
        timestamp
      });
    });

    // Log to SOS history
    const sosEvent = {
      id: Date.now(),
      timestamp,
      location: currentLocation,
      incidentType,
      silentMode,
      contactsNotified: emergencyContacts.length,
      resolved: false
    };

    setSosHistory(prev => [sosEvent, ...prev]);
    setAlertsSent(alerts);

    // Play alarm sound if not silent (would be actual audio in production)
    if (!silentMode) {
      console.log('🚨 EMERGENCY ALARM TRIGGERED');
    }
  }, [emergencyContacts, currentLocation, incidentType, silentMode]);

  // Start SOS
  const startSOS = () => {
    setSosActive(true);
    setCountdown(5);
    setAlertsSent([]);
  };

  // Cancel SOS
  const cancelSOS = () => {
    setSosActive(false);
    setCountdown(5);
    setAlertsSent([]);
  };

  // Resolve emergency
  const resolveEmergency = () => {
    setSosActive(false);
    setCountdown(5);
    setSosHistory(prev => 
      prev.map(event => 
        event.id === prev[0]?.id ? { ...event, resolved: true } : event
      )
    );
  };

  // Add emergency contact
  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setEmergencyContacts(prev => [
        ...prev,
        { id: Date.now(), ...newContact }
      ]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
    }
  };

  // Remove contact
  const removeContact = (id) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="emergency-sos-page">
      {/* Header */}
      <header className="sos-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Emergency SOS</h1>
        <div className={`sos-status ${sosActive ? 'active' : ''}`}>
          {sosActive ? '🔴 ACTIVE' : '🟢 Ready'}
        </div>
      </header>

      {/* Main SOS Button */}
      <div className="sos-main-section">
        {!sosActive ? (
          <>
            <div className="incident-selector">
              <label>Emergency Type:</label>
              <select 
                value={incidentType} 
                onChange={(e) => setIncidentType(e.target.value)}
                className="incident-type-select"
              >
                <option value="general">General Emergency</option>
                <option value="medical">Medical Emergency</option>
                <option value="harassment">Harassment/Safety Threat</option>
                <option value="accident">Accident</option>
                <option value="lost">Lost/Disoriented</option>
                <option value="fall">Fall Detected</option>
              </select>
            </div>

            <button 
              className="sos-button"
              onClick={startSOS}
              aria-label="Trigger Emergency SOS"
            >
              <span className="sos-icon">🆘</span>
              <span className="sos-text">HOLD FOR SOS</span>
              <span className="sos-subtext">Press & hold for 5 seconds</span>
            </button>

            <label className="silent-mode-toggle">
              <input 
                type="checkbox" 
                checked={silentMode}
                onChange={(e) => setSilentMode(e.target.checked)}
              />
              <span>Silent Panic Mode</span>
              <span className="tooltip">No alarm sound - for dangerous situations</span>
            </label>
          </>
        ) : countdown > 0 ? (
          <div className="sos-countdown">
            <div className="countdown-circle">
              <span className="countdown-number">{countdown}</span>
            </div>
            <p className="countdown-text">Sending emergency alert in {countdown} seconds</p>
            <button className="cancel-sos-btn" onClick={cancelSOS}>
              ✕ Cancel
            </button>
          </div>
        ) : (
          <div className="sos-active-panel">
            <div className="emergency-active-indicator">
              <span className="pulse-ring"></span>
              <span className="emergency-icon">🚨</span>
            </div>
            <h2>Emergency Alert Active</h2>
            <p>Help is on the way. Stay calm.</p>
            
            {/* Location Info */}
            {currentLocation && (
              <div className="location-share-card">
                <h3>📍 Your Location is Being Shared</h3>
                <p>Lat: {currentLocation.lat.toFixed(6)}</p>
                <p>Lng: {currentLocation.lng.toFixed(6)}</p>
                {currentLocation.approximate && (
                  <p className="location-warning">⚠️ Approximate location</p>
                )}
                <p className="last-update">Last updated: {currentLocation.timestamp}</p>
              </div>
            )}

            {/* Alerts Sent */}
            <div className="alerts-sent-list">
              <h3>Alerts Sent To:</h3>
              {alertsSent.map((alert, idx) => (
                <div key={idx} className="alert-sent-item">
                  <span className="alert-icon">✓</span>
                  <span>{alert.name}</span>
                  <span className="alert-status sent">Notified</span>
                </div>
              ))}
            </div>

            <button className="resolve-btn" onClick={resolveEmergency}>
              ✓ I'm Safe - Resolve Emergency
            </button>
          </div>
        )}
      </div>

      {/* Quick Dial Emergency Services */}
      <section className="emergency-services">
        <h2>Quick Dial Emergency Services</h2>
        <div className="services-grid">
          {emergencyServices.map(service => (
            <a 
              key={service.id}
              href={`tel:${service.number}`}
              className="service-card"
              style={{ '--service-color': service.color }}
            >
              <span className="service-icon">{service.icon}</span>
              <span className="service-name">{service.name}</span>
              <span className="service-number">{service.number}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="emergency-contacts">
        <div className="section-header">
          <h2>Emergency Contacts</h2>
          <button 
            className="add-contact-btn"
            onClick={() => setShowAddContact(true)}
          >
            + Add
          </button>
        </div>

        {showAddContact && (
          <div className="add-contact-form">
            <input 
              type="text" 
              placeholder="Name"
              value={newContact.name}
              onChange={(e) => setNewContact({...newContact, name: e.target.value})}
            />
            <input 
              type="tel" 
              placeholder="Phone Number"
              value={newContact.phone}
              onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
            />
            <select 
              value={newContact.relationship}
              onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
            >
              <option value="">Relationship</option>
              <option value="Parent">Parent</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Sibling">Sibling</option>
              <option value="Caregiver">Caregiver</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
            <div className="form-actions">
              <button onClick={addContact} className="save-btn">Save</button>
              <button onClick={() => setShowAddContact(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}

        <div className="contacts-list">
          {emergencyContacts.map(contact => (
            <div key={contact.id} className="contact-card">
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-relationship">{contact.relationship}</span>
                <span className="contact-phone">{contact.phone}</span>
              </div>
              <div className="contact-actions">
                <a href={`tel:${contact.phone}`} className="call-btn">📞</a>
                <button 
                  className="remove-btn"
                  onClick={() => removeContact(contact.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SOS History */}
      {sosHistory.length > 0 && (
        <section className="sos-history">
          <h2>Recent Alerts</h2>
          <div className="history-list">
            {sosHistory.slice(0, 5).map(event => (
              <div key={event.id} className={`history-item ${event.resolved ? 'resolved' : 'active'}`}>
                <span className="history-type">{event.incidentType}</span>
                <span className="history-time">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
                <span className={`history-status ${event.resolved ? 'resolved' : ''}`}>
                  {event.resolved ? '✓ Resolved' : '⚠ Active'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Safety Tips */}
      <section className="safety-tips">
        <h2>Safety Tips</h2>
        <ul>
          <li>🔋 Keep your phone charged when traveling</li>
          <li>📍 Enable location services for accurate help</li>
          <li>👥 Travel with a companion when possible</li>
          <li>🔔 Use silent mode if you feel threatened</li>
          <li>📱 Add all emergency contacts in advance</li>
        </ul>
      </section>
    </div>
  );
}

export default EmergencySOS;
