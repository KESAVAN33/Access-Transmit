/**
 * AccessTransit - Train Tracking Screen Component
 * 
 * Real-time train tracking showing:
 * - Live train location on line map
 * - Platform info, crowd levels
 * - Station progress
 * - Notifications and alerts
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getTrainById,
  trainRoutes,
  calculateArrivalTime,
  formatArrivalTime,
  getCrowdIndicator,
  speakText,
  triggerHaptic
} from '../data/busData';

function TrainTrackingScreen() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  
  const [train, setTrain] = useState(null);
  const [route, setRoute] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isTracking, setIsTracking] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const previousTrainState = useRef(null);

  // Load train data and set up real-time tracking
  useEffect(() => {
    const updateTrainData = () => {
      const currentTrain = getTrainById(trainId);
      
      if (!currentTrain) {
        navigate('/'); // Redirect if train not found
        return;
      }

      // Find the route for this train
      const trainRoute = trainRoutes.find(r => r.id === currentTrain.route);
      setRoute(trainRoute);

      // Check for state changes to generate notifications
      if (previousTrainState.current) {
        // Station arrival notification
        if (previousTrainState.current.currentStation !== currentTrain.currentStation) {
          addNotification({
            type: 'success',
            message: `🚉 Arrived at: ${currentTrain.currentStation}`
          });
          if (hapticEnabled) {
            triggerHaptic('stopReached');
            speakText(`Now at ${currentTrain.currentStation}. Next station: ${currentTrain.nextStation}`);
          }
        }

        // Crowd level change notification
        if (previousTrainState.current.crowdLevel !== currentTrain.crowdLevel) {
          if (currentTrain.crowdLevel === 'High') {
            addNotification({
              type: 'warning',
              message: '🔴 Train is now heavily crowded'
            });
            if (hapticEnabled) {
              triggerHaptic('warning');
            }
          }
        }
      }

      // Arrival alert
      const eta = calculateArrivalTime(currentTrain.distanceToNextStation, currentTrain.avgSpeed);
      if (eta !== 'N/A' && eta <= 1 && !previousTrainState.current?.arrivalAlerted) {
        addNotification({
          type: 'success',
          message: `🚆 Arriving at ${currentTrain.nextStation} now!`
        });
        if (hapticEnabled) {
          triggerHaptic('busArrival');
          speakText(`Arriving at ${currentTrain.nextStation}`);
        }
        currentTrain.arrivalAlerted = true;
      } else if (eta > 1) {
        currentTrain.arrivalAlerted = false;
      }

      previousTrainState.current = currentTrain;
      setTrain(currentTrain);
    };

    updateTrainData();
    
    // Update every 2 seconds for smooth tracking
    const interval = setInterval(() => {
      if (isTracking) {
        updateTrainData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [trainId, isTracking, navigate, hapticEnabled]);

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
    if (train && route) {
      const arrival = calculateArrivalTime(train.distanceToNextStation, train.avgSpeed);
      const guidance = `Train ${train.trainId} on ${route.name}. Currently at ${train.currentStation}, heading ${train.direction}. Next station ${train.nextStation} in ${formatArrivalTime(arrival)}. Platform ${train.platform}. Crowd level is ${train.crowdLevel.toLowerCase()}.`;
      speakText(guidance);
    }
  };

  // Dismiss a notification
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!train || !route) {
    return <div className="loading">Loading train tracking data...</div>;
  }

  const arrivalTime = calculateArrivalTime(train.distanceToNextStation, train.avgSpeed);
  const formattedArrival = formatArrivalTime(arrivalTime);
  const crowdIndicator = getCrowdIndicator(train.crowdLevel);

  // Calculate station progress
  const currentStationIndex = route.stations.indexOf(train.currentStation);
  const progressPercent = ((currentStationIndex + 1) / route.stations.length) * 100;

  const getTrainTypeIcon = (type) => {
    switch(type) {
      case 'metro': return '🚇';
      case 'local': return '🚃';
      case 'suburban': return '🚆';
      default: return '🚆';
    }
  };

  return (
    <div className="tracking-screen train-tracking-screen">
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
        <Link to={`/train-route/${route.id}`} className="back-link">
          <span>←</span> Back to Line
        </Link>
        
        <div className="tracking-title">
          <span className="bus-icon-large">{getTrainTypeIcon(train.trainType)}</span>
          <div>
            <h1>Tracking {train.trainId}</h1>
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
        </div>
      </section>

      {/* Train Progress Bar */}
      <section className="train-progress-section">
        <h3>Journey Progress</h3>
        <div className="train-progress-bar">
          <div 
            className="train-progress-fill"
            style={{ width: `${progressPercent}%`, backgroundColor: route.color }}
          ></div>
          <div 
            className="train-position-marker"
            style={{ left: `${progressPercent}%`, backgroundColor: route.color }}
          >
            {getTrainTypeIcon(train.trainType)}
          </div>
        </div>
        <div className="train-progress-labels">
          <span>{route.stations[0]}</span>
          <span>{route.stations[route.stations.length - 1]}</span>
        </div>
      </section>

      {/* Main Content */}
      <div className="tracking-content">
        {/* Line Map Section */}
        <section className="map-section train-map-section">
          <div className="train-line-map">
            <h3>Station Progress</h3>
            <div className="line-stations" style={{ '--line-color': route.color }}>
              {route.stations.slice(
                Math.max(0, currentStationIndex - 2),
                Math.min(route.stations.length, currentStationIndex + 4)
              ).map((station, idx) => {
                const actualIdx = Math.max(0, currentStationIndex - 2) + idx;
                const isPast = actualIdx < currentStationIndex;
                const isCurrent = actualIdx === currentStationIndex;
                const isNext = actualIdx === currentStationIndex + 1;

                return (
                  <div 
                    key={actualIdx} 
                    className={`line-station ${isPast ? 'past' : ''} ${isCurrent ? 'current' : ''} ${isNext ? 'next' : ''}`}
                  >
                    <div className="station-marker" style={{ 
                      backgroundColor: isCurrent ? route.color : isPast ? '#9ca3af' : '#e5e7eb',
                      borderColor: route.color
                    }}>
                      {isCurrent && <span className="pulse"></span>}
                    </div>
                    <span className="station-name">{station}</span>
                    {isCurrent && <span className="current-badge">Current</span>}
                    {isNext && <span className="next-badge">Next • {formattedArrival}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Info */}
          <div className="platform-info">
            <span className="platform-icon">🚉</span>
            <span className="platform-label">Platform</span>
            <span className="platform-number">{train.platform}</span>
          </div>
        </section>

        {/* Status Panel */}
        <section className="status-panel">
          {/* Journey Info */}
          <div className="status-card journey-info">
            <h3>Journey Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Current Station</span>
                <span className="info-value">{train.currentStation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Next Station</span>
                <span className="info-value highlight">{train.nextStation}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Direction</span>
                <span className="info-value">{train.direction}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ETA</span>
                <span className="info-value highlight">{formattedArrival}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Speed</span>
                <span className="info-value">{Math.round(train.avgSpeed)} km/h</span>
              </div>
              <div className="info-item">
                <span className="info-label">Coaches</span>
                <span className="info-value">{train.coaches}</span>
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
                  {train.currentPassengers} / {train.capacity} passengers
                </span>
              </div>
            </div>
            <div className="capacity-bar-large">
              <div 
                className="capacity-fill"
                style={{ 
                  width: `${(train.currentPassengers / train.capacity) * 100}%`,
                  backgroundColor: crowdIndicator.color
                }}
              >
                <span className="capacity-percent">
                  {Math.round((train.currentPassengers / train.capacity) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Train Features */}
          <div className="status-card features-info">
            <h3>Train Features</h3>
            <div className="features-grid">
              <div className={`feature-item ${train.accessible ? 'active' : ''}`}>
                <span className="feature-icon">♿</span>
                <span className="feature-label">Wheelchair Accessible</span>
                <span className={`feature-status ${train.accessible ? 'yes' : 'no'}`}>
                  {train.accessible ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              <div className={`feature-item ${train.acCoach ? 'active' : ''}`}>
                <span className="feature-icon">❄️</span>
                <span className="feature-label">AC Coach</span>
                <span className={`feature-status ${train.acCoach ? 'yes' : 'no'}`}>
                  {train.acCoach ? '✓ Yes' : '✗ No'}
                </span>
              </div>
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
          <span>🔔</span> Set Station Alert
        </button>
      </section>
    </div>
  );
}

export default TrainTrackingScreen;
