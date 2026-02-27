/**
 * AccessTransit - Tracking Screen Component
 * 
 * Real-time tracking screen showing:
 * - Interactive map with bus location
 * - Live crowd level and safety alerts
 * - Animated bus movement
 * - Overcrowding notifications
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getBusById,
  routes,
  calculateArrivalTime,
  formatArrivalTime,
  getCrowdIndicator,
  assessRisk,
  generateVoiceGuidance,
  speakText,
  triggerHaptic
} from '../data/busData';

function TrackingScreen() {
  const { busId } = useParams();
  const navigate = useNavigate();
  
  const [bus, setBus] = useState(null);
  const [route, setRoute] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isTracking, setIsTracking] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [arrivalAlertTriggered, setArrivalAlertTriggered] = useState(false);
  const mapRef = useRef(null);
  const previousBusState = useRef(null);

  // Load bus data and set up real-time tracking
  useEffect(() => {
    const updateBusData = () => {
      const currentBus = getBusById(busId);
      
      if (!currentBus) {
        navigate('/'); // Redirect if bus not found
        return;
      }

      // Find the route for this bus
      const busRoute = routes.find(r => r.id === currentBus.route);
      setRoute(busRoute);

      // Check for state changes to generate notifications
      if (previousBusState.current) {
        const prevRisk = assessRisk(previousBusState.current.crowdLevel, previousBusState.current.turnAngle);
        const newRisk = assessRisk(currentBus.crowdLevel, currentBus.turnAngle);
        
        // Notify on risk level change
        if (prevRisk.level !== newRisk.level) {
          addNotification({
            type: newRisk.level === 'High' ? 'danger' : newRisk.level === 'Medium' ? 'warning' : 'success',
            message: newRisk.level === 'High' 
              ? '⚠️ ALERT: High risk conditions detected!'
              : newRisk.level === 'Medium'
              ? '⚡ Caution: Monitor conditions'
              : '✅ Conditions have improved'
          });
          // Haptic feedback for risk change
          if (hapticEnabled && newRisk.level === 'High') {
            triggerHaptic('warning');
          }
        }

        // Notify on crowd level change to High
        if (previousBusState.current.crowdLevel !== 'High' && currentBus.crowdLevel === 'High') {
          addNotification({
            type: 'warning',
            message: '🔴 Bus is now heavily crowded'
          });
        }

        // HAPTIC: Stop reached detection (when currentStop changes)
        if (previousBusState.current.currentStop !== currentBus.currentStop) {
          addNotification({
            type: 'success',
            message: `📍 Arrived at: ${currentBus.currentStop}`
          });
          if (hapticEnabled) {
            triggerHaptic('stopReached');
            speakText(`Now at ${currentBus.currentStop}. Next stop: ${currentBus.nextStop}`);
          }
        }

        // HAPTIC: Route change detection
        if (previousBusState.current.route !== currentBus.route) {
          addNotification({
            type: 'info',
            message: `🔄 Route changed to: ${currentBus.routeName}`
          });
          if (hapticEnabled) {
            triggerHaptic('routeChange');
          }
        }
      }

      // HAPTIC: Bus arrival alert (when ETA is 2 minutes or less)
      const eta = calculateArrivalTime(currentBus.distanceToNextStop, currentBus.avgSpeed);
      if (eta !== 'N/A' && eta <= 2 && !arrivalAlertTriggered) {
        addNotification({
          type: 'success',
          message: `🚌 Bus arriving in ${eta} minute${eta === 1 ? '' : 's'}!`
        });
        if (hapticEnabled) {
          triggerHaptic('busArrival');
          speakText(`Bus arriving in ${eta} minute${eta === 1 ? '' : 's'}`);
        }
        setArrivalAlertTriggered(true);
      } else if (eta > 2) {
        setArrivalAlertTriggered(false); // Reset for next arrival
      }

      previousBusState.current = currentBus;
      setBus(currentBus);
    };

    updateBusData();
    
    // Update every 2 seconds for smooth tracking
    const interval = setInterval(() => {
      if (isTracking) {
        updateBusData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [busId, isTracking, navigate, hapticEnabled, arrivalAlertTriggered]);

  // Add a notification with auto-dismiss
  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Toggle tracking on/off
  const toggleTracking = () => {
    setIsTracking(prev => !prev);
  };

  // Handle voice guidance
  const handleVoiceGuidance = () => {
    if (bus) {
      const guidance = generateVoiceGuidance(bus);
      speakText(guidance);
    }
  };

  // Dismiss a notification
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!bus || !route) {
    return <div className="loading">Loading tracking data...</div>;
  }

  const arrivalTime = calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed);
  const formattedArrival = formatArrivalTime(arrivalTime);
  const crowdIndicator = getCrowdIndicator(bus.crowdLevel);
  const risk = assessRisk(bus.crowdLevel, bus.turnAngle);

  return (
    <div className="tracking-screen">
      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type}`}
            role="alert"
          >
            <span className="notification-message">{notification.message}</span>
            <button 
              onClick={() => dismissNotification(notification.id)}
              className="notification-dismiss"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <section className="tracking-header">
        <Link to={`/route/${route.id}`} className="back-link">
          <span>←</span> Back to Route
        </Link>
        
        <div className="tracking-title">
          <span className="bus-icon-large">🚌</span>
          <div>
            <h1>Tracking {bus.busId}</h1>
            <p style={{ color: route.color }}>{route.name}</p>
          </div>
        </div>

        <div className="tracking-controls">
          <button 
            onClick={toggleTracking}
            className={`btn-toggle-tracking ${isTracking ? 'active' : ''}`}
          >
            {isTracking ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button 
            onClick={handleVoiceGuidance}
            className="btn-voice-guidance"
            title="Voice guidance"
          >
            🔊 Voice
          </button>
          <button 
            onClick={() => setHapticEnabled(!hapticEnabled)}
            className={`btn-haptic ${hapticEnabled ? 'active' : ''}`}
            title="Toggle haptic vibration alerts"
          >
            {hapticEnabled ? '📳 Vibration On' : '📴 Vibration Off'}
          </button>
          {hapticEnabled && (
            <button 
              onClick={() => triggerHaptic('success')}
              className="btn-test-haptic"
              title="Test vibration on your device"
            >
              📱 Test
            </button>
          )}
        </div>
      </section>

      {/* Risk Alert Banner */}
      {risk.level === 'High' && (
        <div className="tracking-alert-banner danger">
          <span className="alert-icon">⚠️</span>
          <span className="alert-text">{risk.message}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="tracking-content">
        {/* Map Section */}
        <section className="map-section">
          <div className="map-container" ref={mapRef}>
            {/* Simulated Map View */}
            <div className="simulated-map">
              <div className="map-background">
                {/* Route line */}
                <svg className="route-path" viewBox="0 0 400 300">
                  <path 
                    d="M 50,250 Q 100,200 150,180 T 250,120 T 350,50" 
                    stroke={route.color} 
                    strokeWidth="4" 
                    fill="none"
                    strokeDasharray="10,5"
                  />
                  {/* Stop markers */}
                  {route.stops.map((stop, index) => {
                    const x = 50 + (index * 75);
                    const y = 250 - (index * 50);
                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="8" fill="white" stroke={route.color} strokeWidth="3" />
                        <text x={x + 12} y={y + 5} className="stop-label" fontSize="12">{stop}</text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Animated Bus Marker */}
                <div 
                  className="bus-marker animated"
                  style={{
                    left: `${((bus.currentLocation.lng + 74.1) * 1000) % 80 + 10}%`,
                    top: `${((bus.currentLocation.lat - 40.6) * 1000) % 60 + 20}%`,
                    backgroundColor: route.color
                  }}
                >
                  <span className="bus-marker-icon">🚌</span>
                  <div className="bus-marker-pulse"></div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <span className="marker-dot" style={{ backgroundColor: route.color }}></span>
                  <span>Bus Position</span>
                </div>
                <div className="legend-item">
                  <span className="marker-dot stop"></span>
                  <span>Stops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Coordinates */}
          <div className="location-coords">
            <span>📍 Lat: {bus.currentLocation.lat.toFixed(4)}</span>
            <span>Lng: {bus.currentLocation.lng.toFixed(4)}</span>
            <span className="update-time">
              Last update: {new Date(bus.lastUpdated).toLocaleTimeString()}
            </span>
          </div>
        </section>

        {/* Status Panel */}
        <section className="status-panel">
          {/* Journey Info */}
          <div className="status-card journey-info">
            <h3>Journey Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Current Stop</span>
                <span className="info-value">{bus.currentStop}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Next Stop</span>
                <span className="info-value highlight">{bus.nextStop}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Distance</span>
                <span className="info-value">{bus.distanceToNextStop} km</span>
              </div>
              <div className="info-item">
                <span className="info-label">ETA</span>
                <span className="info-value highlight">{formattedArrival}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Speed</span>
                <span className="info-value">{bus.avgSpeed} km/h</span>
              </div>
              <div className="info-item">
                <span className="info-label">Turn Angle</span>
                <span className="info-value">{bus.turnAngle}°</span>
              </div>
            </div>
          </div>

          {/* Crowd Level */}
          <div className="status-card crowd-info">
            <h3>Crowd Level</h3>
            <div className="crowd-display">
              <span className="crowd-emoji-large">{crowdIndicator.emoji}</span>
              <div className="crowd-details">
                <span className="crowd-level-text" style={{ color: crowdIndicator.color }}>
                  {crowdIndicator.text}
                </span>
                <span className="passenger-info">
                  {bus.currentPassengers} / {bus.capacity} passengers
                </span>
              </div>
            </div>
            <div className="capacity-bar-large">
              <div 
                className="capacity-fill"
                style={{ 
                  width: `${(bus.currentPassengers / bus.capacity) * 100}%`,
                  backgroundColor: crowdIndicator.color
                }}
              >
                <span className="capacity-percent">
                  {Math.round((bus.currentPassengers / bus.capacity) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Safety Status */}
          <div className={`status-card safety-info ${risk.level.toLowerCase()}`}>
            <h3>Safety Status</h3>
            <div className="safety-display">
              <span className="safety-icon-large">{risk.icon}</span>
              <div className="safety-details">
                <span className="safety-level">{risk.level} Risk</span>
                <span className="safety-message">{risk.message}</span>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="status-card accessibility-info">
            <h3>Accessibility</h3>
            <div className="accessibility-display">
              {bus.accessible ? (
                <>
                  <span className="accessible-icon">♿</span>
                  <span className="accessible-text">
                    This bus is <strong>wheelchair accessible</strong>
                  </span>
                </>
              ) : (
                <>
                  <span className="not-accessible-icon">🚫</span>
                  <span className="not-accessible-text">
                    This bus is <strong>not wheelchair accessible</strong>
                  </span>
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <button className="action-btn share">
          <span>📤</span> Share Location
        </button>
        <button className="action-btn report">
          <span>📝</span> Report Issue
        </button>
        <button className="action-btn alert">
          <span>🔔</span> Set Arrival Alert
        </button>
      </section>
    </div>
  );
}

export default TrackingScreen;
