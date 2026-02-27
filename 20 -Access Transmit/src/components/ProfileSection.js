/**
 * AccessTransit - Profile Section Component
 *
 * Comprehensive user profile with settings and travel stats.
 */
import React, { useState } from 'react';

function getKyc() {
  try {
    return JSON.parse(window.sessionStorage.getItem('accesstransit_kyc')) || null;
  } catch {
    return null;
  }
}

const disabilityLabels = {
  none: 'No Accessibility Needs',
  wheelchair: 'Wheelchair User ♿',
  visual: 'Visual Impairment 👁️',
  hearing: 'Hearing Impairment 👂',
  cognitive: 'Cognitive Support 🧠',
  elderly: 'Elderly/Mobility 👴'
};

function ProfileSection({ onLogout }) {
  const kyc = getKyc();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock travel stats
  const travelStats = {
    totalTrips: 47,
    thisMonth: 12,
    co2Saved: '23.5 kg',
    favoriteRoute: 'Route 1A',
    accessibleTrips: 38
  };

  // Mock settings
  const [settings, setSettings] = useState({
    voiceAssistant: true,
    highContrast: false,
    largeText: false,
    vibrationAlerts: true,
    crowdAlerts: true,
    emergencyContacts: true
  });

  if (!kyc) {
    return (
      <div className="profile-section">
        <div className="profile-empty">
          <span className="empty-icon">👤</span>
          <h2>No Profile Found</h2>
          <p>Please complete the signup process to access your profile.</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem('accesstransit_kyc');
    if (onLogout) onLogout();
    window.location.reload();
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="profile-section">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          <span>{kyc.name?.charAt(0)?.toUpperCase() || '?'}</span>
        </div>
        <div className="profile-header-info">
          <h1>{kyc.name}</h1>
          <p className="profile-subtitle">
            📍 {kyc.city} • {kyc.isCaregiver ? '🤝 Caregiver' : '🚌 Commuter'}
          </p>
          {kyc.disabilityType && kyc.disabilityType !== 'none' && (
            <span className="accessibility-badge">
              {disabilityLabels[kyc.disabilityType] || kyc.disabilityType}
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={`profile-tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-details">
            <div className="detail-card">
              <h3>Personal Information</h3>
              <div className="detail-row">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{kyc.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{kyc.phone || 'Not provided'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">City</span>
                <span className="detail-value">{kyc.city}</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Accessibility Profile</h3>
              <div className="detail-row">
                <span className="detail-label">Accessibility Needs</span>
                <span className="detail-value">
                  {disabilityLabels[kyc.disabilityType] || 'None specified'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Type</span>
                <span className="detail-value">
                  {kyc.isCaregiver ? '🤝 Caregiver Account' : '👤 Personal Account'}
                </span>
              </div>
            </div>

            <button className="btn-logout" onClick={handleLogout}>
              🚪 Log Out
            </button>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="profile-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🚌</span>
                <span className="stat-value">{travelStats.totalTrips}</span>
                <span className="stat-label">Total Trips</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📅</span>
                <span className="stat-value">{travelStats.thisMonth}</span>
                <span className="stat-label">This Month</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-icon">🌱</span>
                <span className="stat-value">{travelStats.co2Saved}</span>
                <span className="stat-label">CO₂ Saved</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">♿</span>
                <span className="stat-value">{travelStats.accessibleTrips}</span>
                <span className="stat-label">Accessible Trips</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Travel Insights</h3>
              <div className="detail-row">
                <span className="detail-label">Most Used Route</span>
                <span className="detail-value">{travelStats.favoriteRoute}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Accessibility Rating</span>
                <span className="detail-value">⭐ 4.8/5.0</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Reports Submitted</span>
                <span className="detail-value">3 issues reported</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="profile-settings">
            <div className="detail-card">
              <h3>Accessibility Settings</h3>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">🎤 Voice Assistant</span>
                  <span className="setting-desc">Enable voice commands and audio feedback</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.voiceAssistant}
                    onChange={() => toggleSetting('voiceAssistant')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">🔲 High Contrast Mode</span>
                  <span className="setting-desc">Increase contrast for better visibility</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.highContrast}
                    onChange={() => toggleSetting('highContrast')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">🔤 Large Text</span>
                  <span className="setting-desc">Increase text size throughout the app</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.largeText}
                    onChange={() => toggleSetting('largeText')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="detail-card">
              <h3>Notifications</h3>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">📳 Vibration Alerts</span>
                  <span className="setting-desc">Vibrate for important notifications</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.vibrationAlerts}
                    onChange={() => toggleSetting('vibrationAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">👥 Crowd Density Alerts</span>
                  <span className="setting-desc">Get notified about crowded vehicles</span>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.crowdAlerts}
                    onChange={() => toggleSetting('crowdAlerts')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSection;
