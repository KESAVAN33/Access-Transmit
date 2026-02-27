/**
 * AccessTransit - Smart Route Planner Component
 * 
 * Disability-aware route planning:
 * - Considers user's specific accessibility needs
 * - Avoids known accessibility issues
 * - Suggests safest and most accessible route
 * - Accounts for weather conditions
 * - Predicts crowd levels
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { routes, trainRoutes, getAllBuses } from '../data/busData';

// User accessibility profiles
const accessibilityProfiles = [
  { id: 'wheelchair', icon: '♿', label: 'Wheelchair User', needs: ['ramp', 'elevator', 'wide-door', 'low-floor'] },
  { id: 'visual', icon: '👁️', label: 'Visual Impairment', needs: ['audio', 'tactile', 'staff-assist'] },
  { id: 'hearing', icon: '👂', label: 'Hearing Impairment', needs: ['visual-display', 'text-alerts'] },
  { id: 'cognitive', icon: '🧠', label: 'Cognitive Support', needs: ['simple-route', 'reminders', 'companion'] },
  { id: 'elderly', icon: '👴', label: 'Elderly/Mobility', needs: ['seating', 'low-crowd', 'short-walk'] },
  { id: 'parent', icon: '👶', label: 'With Stroller', needs: ['ramp', 'elevator', 'space'] }
];

// Simulated route options
const generateRouteOptions = (from, to, profile) => {
  const options = [
    {
      id: 1,
      type: 'Most Accessible',
      recommended: true,
      accessibilityScore: 95,
      duration: '35 mins',
      transfers: 0,
      walkingDistance: '150m',
      crowdLevel: 'Low',
      cost: '₹25',
      steps: [
        { type: 'walk', duration: '3 mins', instruction: 'Walk to Central Station (accessible path)', distance: '100m' },
        { type: 'bus', vehicle: 'Bus CBE-101', route: 'Downtown Express', duration: '25 mins', features: ['wheelchair-ramp', 'low-floor', 'audio'] },
        { type: 'walk', duration: '2 mins', instruction: 'Walk to destination', distance: '50m' }
      ],
      alerts: [],
      features: ['Wheelchair accessible', 'Audio announcements', 'Low crowd expected', 'Priority seating available']
    },
    {
      id: 2,
      type: 'Fastest',
      recommended: false,
      accessibilityScore: 72,
      duration: '22 mins',
      transfers: 1,
      walkingDistance: '400m',
      crowdLevel: 'High',
      cost: '₹30',
      steps: [
        { type: 'walk', duration: '5 mins', instruction: 'Walk to Metro Station', distance: '250m' },
        { type: 'metro', vehicle: 'Metro Blue Line', duration: '12 mins', features: ['elevator', 'tactile'] },
        { type: 'walk', duration: '5 mins', instruction: 'Walk to destination', distance: '150m' }
      ],
      alerts: ['⚠️ Elevator at Platform 2 under maintenance', '⚠️ Expected high crowd'],
      features: ['Elevator available (partial)', 'Tactile paths']
    },
    {
      id: 3,
      type: 'Least Walking',
      recommended: false,
      accessibilityScore: 88,
      duration: '40 mins',
      transfers: 1,
      walkingDistance: '80m',
      crowdLevel: 'Medium',
      cost: '₹35',
      steps: [
        { type: 'walk', duration: '1 min', instruction: 'Board at doorstep pickup point', distance: '30m' },
        { type: 'bus', vehicle: 'Bus CBE-105', route: 'RS Puram Loop', duration: '20 mins', features: ['wheelchair-ramp', 'low-floor'] },
        { type: 'transfer', duration: '5 mins', instruction: 'Transfer at RS Puram (same platform)' },
        { type: 'bus', vehicle: 'Bus CBE-102', route: 'Medical District', duration: '12 mins', features: ['wheelchair-ramp', 'audio'] },
        { type: 'walk', duration: '2 mins', instruction: 'Walk to destination', distance: '50m' }
      ],
      alerts: [],
      features: ['Minimal walking', 'Same-platform transfer', 'Wheelchair ramp on all vehicles']
    }
  ];

  return options;
};

// Popular destinations
const popularDestinations = [
  { id: 1, name: 'Central Hospital', icon: '🏥', address: 'Medical District' },
  { id: 2, name: 'City Mall', icon: '🛒', address: 'RS Puram' },
  { id: 3, name: 'Railway Station', icon: '🚉', address: 'Junction' },
  { id: 4, name: 'Airport', icon: '✈️', address: 'Terminal 1' },
  { id: 5, name: 'Government Office', icon: '🏛️', address: 'Collectorate' }
];

// Recent searches
const recentSearches = [
  { from: 'Home', to: 'Central Hospital' },
  { from: 'Home', to: 'RS Puram Market' }
];

function SmartRoutePlanner() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [routeOptions, setRouteOptions] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxWalking: 500,
    maxTransfers: 2,
    avoidCrowds: true,
    wheelchairOnly: false,
    preferSeated: false
  });
  const [isSearching, setIsSearching] = useState(false);
  const [currentWeather, setCurrentWeather] = useState({ condition: 'sunny', temp: 28 });
  const [savedRoutes, setSavedRoutes] = useState([]);

  // Load user profile from KYC
  useEffect(() => {
    try {
      const kyc = JSON.parse(window.sessionStorage.getItem('accesstransit_kyc'));
      if (kyc?.disabilityType) {
        const profile = accessibilityProfiles.find(p => p.id === kyc.disabilityType);
        if (profile) setSelectedProfile(profile);
      }
    } catch {}
  }, []);

  // Search routes
  const searchRoutes = () => {
    if (!from || !to) {
      alert('Please enter both origin and destination');
      return;
    }

    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const options = generateRouteOptions(from, to, selectedProfile);
      setRouteOptions(options);
      setIsSearching(false);
    }, 1500);
  };

  // Use current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFrom('Current Location');
        },
        (error) => {
          setFrom('Home (default)');
        }
      );
    } else {
      setFrom('Home (default)');
    }
  };

  // Swap from/to
  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  // Save route
  const saveRoute = (route) => {
    setSavedRoutes(prev => [...prev, { ...route, savedAt: new Date().toISOString() }]);
  };

  // Start navigation
  const startNavigation = (route) => {
    // Would integrate with TrackingScreen
    alert(`Starting navigation via ${route.type} route. Duration: ${route.duration}`);
  };

  return (
    <div className="smart-planner-page">
      {/* Header */}
      <header className="planner-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>🧭 Smart Route Planner</h1>
        <button 
          className="filter-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          ⚙️
        </button>
      </header>

      {/* Accessibility Profile Selector */}
      <section className="profile-selector">
        <h3>Your Accessibility Needs</h3>
        <div className="profiles-row">
          {accessibilityProfiles.map(profile => (
            <button 
              key={profile.id}
              className={`profile-chip ${selectedProfile?.id === profile.id ? 'active' : ''}`}
              onClick={() => setSelectedProfile(profile)}
            >
              <span className="profile-icon">{profile.icon}</span>
              <span className="profile-label">{profile.label}</span>
            </button>
          ))}
        </div>
        {selectedProfile && (
          <p className="profile-needs">
            Optimizing for: {selectedProfile.needs.join(', ')}
          </p>
        )}
      </section>

      {/* Weather Alert */}
      <div className="weather-banner">
        <span className="weather-icon">
          {currentWeather.condition === 'sunny' ? '☀️' : 
           currentWeather.condition === 'rainy' ? '🌧️' : '⛅'}
        </span>
        <span className="weather-info">
          {currentWeather.temp}°C, {currentWeather.condition}
        </span>
        {currentWeather.condition === 'rainy' && selectedProfile?.id === 'wheelchair' && (
          <span className="weather-alert">
            ⚠️ Rain advisory: Indoor routes recommended
          </span>
        )}
      </div>

      {/* Search Form */}
      <section className="search-form">
        <div className="location-inputs">
          <div className="input-group from">
            <span className="input-icon">🔵</span>
            <input 
              type="text"
              placeholder="From (Origin)"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <button 
              className="current-location-btn"
              onClick={useCurrentLocation}
              title="Use current location"
            >
              📍
            </button>
          </div>
          
          <button className="swap-btn" onClick={swapLocations}>
            ⇅
          </button>
          
          <div className="input-group to">
            <span className="input-icon">🔴</span>
            <input 
              type="text"
              placeholder="To (Destination)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        <button 
          className="search-btn"
          onClick={searchRoutes}
          disabled={isSearching}
        >
          {isSearching ? '🔍 Finding best routes...' : '🔍 Find Accessible Routes'}
        </button>
      </section>

      {/* Quick Destinations */}
      {!routeOptions.length && (
        <section className="quick-destinations">
          <h3>Popular Destinations</h3>
          <div className="destinations-grid">
            {popularDestinations.map(dest => (
              <button 
                key={dest.id}
                className="destination-card"
                onClick={() => setTo(dest.name)}
              >
                <span className="dest-icon">{dest.icon}</span>
                <span className="dest-name">{dest.name}</span>
              </button>
            ))}
          </div>

          {recentSearches.length > 0 && (
            <>
              <h3>Recent Searches</h3>
              <div className="recent-searches">
                {recentSearches.map((search, idx) => (
                  <button 
                    key={idx}
                    className="recent-search-item"
                    onClick={() => {
                      setFrom(search.from);
                      setTo(search.to);
                    }}
                  >
                    <span>{search.from}</span>
                    <span className="arrow">→</span>
                    <span>{search.to}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <section className="filters-panel">
          <h3>Route Preferences</h3>
          
          <div className="filter-item">
            <label>Max Walking Distance</label>
            <div className="range-input">
              <input 
                type="range"
                min="100"
                max="1000"
                step="50"
                value={filters.maxWalking}
                onChange={(e) => setFilters({...filters, maxWalking: parseInt(e.target.value)})}
              />
              <span>{filters.maxWalking}m</span>
            </div>
          </div>

          <div className="filter-item">
            <label>Max Transfers</label>
            <div className="button-group">
              {[0, 1, 2, 3].map(n => (
                <button 
                  key={n}
                  className={filters.maxTransfers === n ? 'active' : ''}
                  onClick={() => setFilters({...filters, maxTransfers: n})}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={filters.avoidCrowds}
              onChange={(e) => setFilters({...filters, avoidCrowds: e.target.checked})}
            />
            <span>Avoid Crowded Routes</span>
          </label>

          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={filters.wheelchairOnly}
              onChange={(e) => setFilters({...filters, wheelchairOnly: e.target.checked})}
            />
            <span>Wheelchair Accessible Only</span>
          </label>

          <label className="checkbox-item">
            <input 
              type="checkbox"
              checked={filters.preferSeated}
              onChange={(e) => setFilters({...filters, preferSeated: e.target.checked})}
            />
            <span>Prefer Routes with Guaranteed Seating</span>
          </label>
        </section>
      )}

      {/* Route Options */}
      {routeOptions.length > 0 && (
        <section className="route-options">
          <h3>Route Options</h3>
          <p className="route-summary">{from} → {to}</p>
          
          {routeOptions.map(route => (
            <div 
              key={route.id}
              className={`route-option-card ${route.recommended ? 'recommended' : ''} ${selectedRoute?.id === route.id ? 'selected' : ''}`}
              onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
            >
              <div className="route-header">
                <span className="route-type">{route.type}</span>
                {route.recommended && <span className="recommended-badge">✓ Recommended</span>}
                <div className="accessibility-score">
                  <span className="score-label">Accessibility</span>
                  <span className={`score-value ${route.accessibilityScore >= 90 ? 'excellent' : route.accessibilityScore >= 70 ? 'good' : 'fair'}`}>
                    {route.accessibilityScore}%
                  </span>
                </div>
              </div>

              <div className="route-info-grid">
                <div className="info-item">
                  <span className="icon">⏱️</span>
                  <span className="value">{route.duration}</span>
                  <span className="label">Duration</span>
                </div>
                <div className="info-item">
                  <span className="icon">🔄</span>
                  <span className="value">{route.transfers}</span>
                  <span className="label">Transfers</span>
                </div>
                <div className="info-item">
                  <span className="icon">🚶</span>
                  <span className="value">{route.walkingDistance}</span>
                  <span className="label">Walking</span>
                </div>
                <div className="info-item">
                  <span className="icon">👥</span>
                  <span className={`value crowd-${route.crowdLevel.toLowerCase()}`}>{route.crowdLevel}</span>
                  <span className="label">Crowd</span>
                </div>
              </div>

              {/* Alerts */}
              {route.alerts.length > 0 && (
                <div className="route-alerts">
                  {route.alerts.map((alert, idx) => (
                    <p key={idx} className="alert-item">{alert}</p>
                  ))}
                </div>
              )}

              {/* Features */}
              <div className="route-features">
                {route.features.slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="feature-tag">✓ {feature}</span>
                ))}
              </div>

              {/* Expanded Steps */}
              {selectedRoute?.id === route.id && (
                <div className="route-steps">
                  <h4>Journey Steps</h4>
                  {route.steps.map((step, idx) => (
                    <div key={idx} className={`step-item step-${step.type}`}>
                      <div className="step-icon">
                        {step.type === 'walk' ? '🚶' : 
                         step.type === 'bus' ? '🚌' : 
                         step.type === 'metro' ? '🚇' : 
                         step.type === 'transfer' ? '🔄' : '📍'}
                      </div>
                      <div className="step-details">
                        <p className="step-instruction">
                          {step.instruction || `Take ${step.vehicle} - ${step.route}`}
                        </p>
                        <p className="step-meta">
                          {step.duration} {step.distance && `• ${step.distance}`}
                        </p>
                        {step.features && (
                          <div className="step-features">
                            {step.features.map((f, i) => (
                              <span key={i} className="mini-feature">{f}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="route-actions">
                    <button 
                      className="start-btn"
                      onClick={() => startNavigation(route)}
                    >
                      🚀 Start Navigation
                    </button>
                    <button 
                      className="save-btn"
                      onClick={() => saveRoute(route)}
                    >
                      💾 Save Route
                    </button>
                    <button className="share-btn">
                      📤 Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="searching-overlay">
          <div className="searching-content">
            <div className="loader"></div>
            <p>Finding the most accessible routes...</p>
            <p className="sub">Checking elevator status, crowd levels, and accessibility features</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartRoutePlanner;
