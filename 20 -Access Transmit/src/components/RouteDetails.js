/**
 * AccessTransit - Route Details Screen
 * 
 * Shows detailed information about a specific route including:
 * - List of buses on this route
 * - Real-time location and crowd density
 * - Risk alerts
 * - Predicted arrival times
 */

import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AccessibilityContext } from '../App';
import {
  routes,
  getBusesForRoute,
  filterAccessibleBuses,
  calculateArrivalTime,
  formatArrivalTime,
  getCrowdIndicator,
  assessRisk,
  generateVoiceGuidance,
  speakText,
  calculateRecommendationScore,
  getRecommendedBus,
  detectFallRisk,
  predictOvercrowding,
  calculateSafetyScore
} from '../data/busData';

function RouteDetails() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const { accessibilityMode } = useContext(AccessibilityContext);
  
  const [buses, setBuses] = useState([]);
  const [route, setRoute] = useState(null);
  const [sortBy, setSortBy] = useState('arrival'); // 'arrival', 'crowd', 'distance'
  const [speakingBusId, setSpeakingBusId] = useState(null);

  // Find the route and load buses
  useEffect(() => {
    const currentRoute = routes.find(r => r.id === routeId);
    if (!currentRoute) {
      navigate('/'); // Redirect if route not found
      return;
    }
    setRoute(currentRoute);

    const updateBuses = () => {
      let routeBuses = getBusesForRoute(routeId);
      // Apply accessibility filter if mode is on
      routeBuses = filterAccessibleBuses(routeBuses, accessibilityMode);
      setBuses(routeBuses);
    };

    updateBuses();
    // Update every 3 seconds for real-time updates
    const interval = setInterval(updateBuses, 3000);
    return () => clearInterval(interval);
  }, [routeId, accessibilityMode, navigate]);

  // Sort buses based on selected criteria
  const sortedBuses = [...buses].sort((a, b) => {
    switch (sortBy) {
      case 'arrival':
        const arrivalA = calculateArrivalTime(a.distanceToNextStop, a.avgSpeed);
        const arrivalB = calculateArrivalTime(b.distanceToNextStop, b.avgSpeed);
        return arrivalA - arrivalB;
      case 'crowd':
        const crowdOrder = { 'Low': 0, 'Medium': 1, 'High': 2 };
        return crowdOrder[a.crowdLevel] - crowdOrder[b.crowdLevel];
      case 'distance':
        return a.distanceToNextStop - b.distanceToNextStop;
      default:
        return 0;
    }
  });

  // Handle voice guidance button click
  const handleVoiceGuidance = (bus) => {
    const guidance = generateVoiceGuidance(bus);
    const success = speakText(guidance);
    if (success) {
      setSpeakingBusId(bus.busId);
      // Reset after speech duration (approximate)
      setTimeout(() => setSpeakingBusId(null), 8000);
    } else {
      alert('Voice guidance is not supported in your browser.');
    }
  };

  if (!route) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="route-details-screen">
      {/* Route Header */}
      <section className="route-header-section">
        <Link to="/" className="back-link">
          <span>←</span> Back to Routes
        </Link>
        
        <div className="route-info">
          <div 
            className="route-color-indicator" 
            style={{ backgroundColor: route.color }}
          ></div>
          <div className="route-title">
            <h1>{route.name}</h1>
            <p>{route.description}</p>
          </div>
        </div>

        {/* Route Stops */}
        <div className="route-stops-timeline">
          <h3>Route Stops</h3>
          <div className="stops-timeline">
            {route.stops.map((stop, index) => (
              <div key={index} className="stop-item">
                <div className="stop-dot" style={{ backgroundColor: route.color }}></div>
                <span className="stop-name">{stop}</span>
                {index < route.stops.length - 1 && <div className="stop-line"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="controls-section">
        <div className="bus-count">
          <span className="count">{sortedBuses.length}</span>
          <span className="label">
            {sortedBuses.length === 1 ? 'Bus' : 'Buses'} Available
            {accessibilityMode && ' (Accessible only)'}
          </span>
        </div>
        
        <div className="sort-controls">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="arrival">Arrival Time</option>
            <option value="crowd">Crowd Level (Low first)</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </section>

      {/* Bus List */}
      <section className="bus-list-section">
        {sortedBuses.length === 0 ? (
          <div className="no-buses">
            <p>
              {accessibilityMode 
                ? 'No accessible buses available on this route at the moment.'
                : 'No buses available on this route at the moment.'}
            </p>
            <Link to="/" className="btn-primary">View Other Routes</Link>
          </div>
        ) : (
          <div className="bus-list">
            {sortedBuses.map(bus => {
              const arrivalTime = calculateArrivalTime(bus.distanceToNextStop, bus.avgSpeed);
              const formattedArrival = formatArrivalTime(arrivalTime);
              const crowdIndicator = getCrowdIndicator(bus.crowdLevel);
              const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
              const isSpeaking = speakingBusId === bus.busId;
              const recommendedBus = getRecommendedBus(sortedBuses);
              const isRecommended = recommendedBus && recommendedBus.busId === bus.busId;
              const fallRisk = detectFallRisk(bus);
              const overcrowdingForecast = predictOvercrowding(bus);
              const safetyScore = calculateSafetyScore(bus);

              return (
                <div 
                  key={bus.busId} 
                  className={`bus-card ${risk.level === 'High' ? 'high-risk' : ''} ${bus.accessible ? 'accessible' : ''} ${isRecommended ? 'recommended' : ''}`}
                >
                  {/* AI Recommended Badge */}
                  {isRecommended && (
                    <div className="recommended-badge">🤖 AI Recommended Bus</div>
                  )}
                  {/* Fall Risk Alert */}
                  {fallRisk.alert && (
                    <div className="fall-risk-alert">{fallRisk.message}</div>
                  )}
                  {/* Predictive Overcrowding Forecast */}
                  {overcrowdingForecast.forecast && (
                    <div className="overcrowding-forecast">{overcrowdingForecast.message}</div>
                  )}
                  {/* Risk Alert Banner */}
                  {risk.level === 'High' && (
                    <div className="risk-alert-banner">
                      {risk.message}
                    </div>
                  )}

                  <div className="bus-card-content">
                    {/* Bus Header */}
                    <div className="bus-header">
                      <div className="bus-id-section">
                        <span className="bus-icon">🚌</span>
                        <span className="bus-id">{bus.busId}</span>
                        {bus.accessible && (
                          <span className="accessible-badge" title="Wheelchair Accessible">♿</span>
                        )}
                      </div>
                      <div className="arrival-badge">
                        <span className="arrival-time">{formattedArrival}</span>
                        <span className="arrival-label">to next stop</span>
                      </div>
                    </div>

                    {/* Bus Location Info */}
                    <div className="bus-location-info">
                      <div className="location-row">
                        <span className="label">Current Stop:</span>
                        <span className="value">{bus.currentStop}</span>
                      </div>
                      <div className="location-row">
                        <span className="label">Next Stop:</span>
                        <span className="value">{bus.nextStop}</span>
                      </div>
                      <div className="location-row">
                        <span className="label">Distance:</span>
                        <span className="value">{bus.distanceToNextStop} km</span>
                      </div>
                      <div className="location-row">
                        <span className="label">Speed:</span>
                        <span className="value">{bus.avgSpeed} km/h</span>
                      </div>
                    </div>

                    {/* Crowd & Safety Status */}
                    <div className="bus-status-section">
                      {/* Crowd Level */}
                      <div 
                        className="crowd-status" 
                        style={{ borderColor: crowdIndicator.color }}
                      >
                        <span className="crowd-emoji">{crowdIndicator.emoji}</span>
                        <div className="crowd-details">
                          <span className="crowd-level">{crowdIndicator.text}</span>
                          <span className="passenger-count">
                            {bus.currentPassengers}/{bus.capacity} passengers
                          </span>
                          <div className="capacity-bar">
                            <div 
                              className="capacity-fill"
                              style={{ 
                                width: `${(bus.currentPassengers / bus.capacity) * 100}%`,
                                backgroundColor: crowdIndicator.color
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Safety Status */}
                      <div className={`safety-status ${risk.level.toLowerCase()}`}>
                        <span className="safety-icon">{risk.icon}</span>
                        <span className="safety-text">
                          {risk.level === 'Low' ? 'Safe' : risk.level}
                        </span>
                      </div>
                      {/* Safety Score */}
                      <div className="safety-score-display">
                        <span className="safety-score-label">Safety</span>
                        <span className="safety-score-value" style={{color: safetyScore >= 70 ? '#22c55e' : safetyScore >= 40 ? '#eab308' : '#ef4444'}}>{safetyScore}%</span>
                        <div className="safety-score-bar">
                          <div className="safety-score-fill" style={{width: `${safetyScore}%`, background: safetyScore >= 70 ? '#22c55e' : safetyScore >= 40 ? '#eab308' : '#ef4444'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bus-actions">
                      <Link 
                        to={`/track/${bus.busId}`}
                        className="btn-track"
                      >
                        <span>📍</span> Track Bus
                      </Link>
                      
                      {/* Voice Guidance Button (Accessibility Feature) */}
                      <button 
                        className={`btn-voice ${isSpeaking ? 'speaking' : ''}`}
                        onClick={() => handleVoiceGuidance(bus)}
                        disabled={isSpeaking}
                        title="Speak bus information"
                      >
                        <span>{isSpeaking ? '🔊' : '🔈'}</span>
                        {isSpeaking ? 'Speaking...' : 'Voice Info'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Risk Alert Legend */}
      {sortedBuses.some(bus => assessRisk(bus.crowdLevel, bus.turnAngle).level === 'High') && (
        <section className="alert-explanation">
          <h3>⚠️ Safety Alert Explanation</h3>
          <p>
            High risk alerts are shown when a bus has <strong>high crowd levels</strong> combined with 
            <strong> sharp turns (angle &gt; 30°)</strong>. This combination increases the risk of 
            passenger falls or discomfort. Consider waiting for a less crowded bus if possible.
          </p>
        </section>
      )}
    </div>
  );
}

export default RouteDetails;
