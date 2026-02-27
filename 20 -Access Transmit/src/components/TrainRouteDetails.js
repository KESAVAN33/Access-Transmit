/**
 * AccessTransit - Train Route Details Component
 * 
 * Displays:
 * - Train line information
 * - List of active trains
 * - Real-time crowd and accessibility info
 * - Platform information
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  trainRoutes,
  getTrainsByRoute,
  calculateArrivalTime,
  formatArrivalTime,
  getCrowdIndicator
} from '../data/busData';

function TrainRouteDetails() {
  const { routeId } = useParams();
  const [route, setRoute] = useState(null);
  const [trains, setTrains] = useState([]);

  // Load route and train data
  useEffect(() => {
    const trainRoute = trainRoutes.find(r => r.id === routeId);
    setRoute(trainRoute);

    const updateTrains = () => {
      const routeTrains = getTrainsByRoute(routeId);
      setTrains(routeTrains);
    };

    updateTrains();
    // Update every 2 seconds
    const interval = setInterval(updateTrains, 2000);
    return () => clearInterval(interval);
  }, [routeId]);

  if (!route) {
    return (
      <div className="loading">
        <p>Loading train route...</p>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  const getTrainTypeIcon = (type) => {
    switch(type) {
      case 'metro': return '🚇';
      case 'local': return '🚃';
      case 'suburban': return '🚆';
      default: return '🚆';
    }
  };

  return (
    <div className="route-details train-route-details">
      {/* Route Header */}
      <section className="route-details-header" style={{ '--route-color': route.color }}>
        <Link to="/" className="back-link">
          <span>←</span> Back to Routes
        </Link>
        
        <div className="route-title-section">
          <div className="route-color-indicator" style={{ backgroundColor: route.color }}></div>
          <div className="route-title-info">
            <div className="route-type-badge">
              <span>{getTrainTypeIcon(route.type)}</span>
              <span className="type-text">{route.type.toUpperCase()}</span>
            </div>
            <h1>{route.name}</h1>
            <p className="route-city">📍 {route.city}</p>
            <p className="route-desc">{route.description}</p>
          </div>
        </div>

        <div className="route-meta">
          <div className="meta-item">
            <span className="meta-icon">🚉</span>
            <span className="meta-value">{route.stations.length}</span>
            <span className="meta-label">Stations</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🚆</span>
            <span className="meta-value">{trains.length}</span>
            <span className="meta-label">Active Trains</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-value frequency">{route.frequency}</span>
            <span className="meta-label">Frequency</span>
          </div>
        </div>
      </section>

      {/* Stations List */}
      <section className="stations-section">
        <h2>Stations on this Line</h2>
        <div className="stations-line" style={{ '--line-color': route.color }}>
          {route.stations.map((station, index) => (
            <div key={index} className="station-item">
              <div className="station-dot" style={{ backgroundColor: route.color }}></div>
              <div className="station-connector" style={{ backgroundColor: route.color }}></div>
              <span className="station-name">{station}</span>
              {index === 0 && <span className="terminus-badge">Start</span>}
              {index === route.stations.length - 1 && <span className="terminus-badge">End</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Active Trains */}
      <section className="trains-section">
        <h2>Active Trains</h2>
        
        {trains.length === 0 ? (
          <div className="no-trains">
            <p>No trains currently active on this line.</p>
          </div>
        ) : (
          <div className="trains-list">
            {trains.map(train => {
              const arrival = calculateArrivalTime(train.distanceToNextStation, train.avgSpeed);
              const formattedArrival = formatArrivalTime(arrival);
              const crowdIndicator = getCrowdIndicator(train.crowdLevel);

              return (
                <Link
                  to={`/track-train/${train.trainId}`}
                  key={train.trainId}
                  className="train-card"
                  style={{ '--train-color': route.color }}
                >
                  <div className="train-card-header">
                    <div className="train-id">
                      <span className="train-icon">{getTrainTypeIcon(train.trainType)}</span>
                      <span className="train-number">{train.trainId}</span>
                    </div>
                    <div className="train-direction">
                      <span className="direction-arrow">→</span>
                      <span>{train.direction}</span>
                    </div>
                  </div>

                  <div className="train-location">
                    <div className="location-current">
                      <span className="label">At Station</span>
                      <span className="value">{train.currentStation}</span>
                    </div>
                    <div className="location-arrow">→</div>
                    <div className="location-next">
                      <span className="label">Next Station</span>
                      <span className="value">{train.nextStation}</span>
                    </div>
                  </div>

                  <div className="train-stats">
                    <div className="stat">
                      <span className="stat-label">ETA</span>
                      <span className="stat-value highlight">{formattedArrival}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Platform</span>
                      <span className="stat-value">{train.platform}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Coaches</span>
                      <span className="stat-value">{train.coaches}</span>
                    </div>
                    <div className="stat crowd">
                      <span className="stat-label">Crowd</span>
                      <span className="stat-value" style={{ color: crowdIndicator.color }}>
                        {crowdIndicator.emoji} {crowdIndicator.text}
                      </span>
                    </div>
                  </div>

                  <div className="train-features">
                    {train.accessible && (
                      <span className="feature-badge accessible">♿ Accessible</span>
                    )}
                    {train.acCoach && (
                      <span className="feature-badge ac">❄️ AC Coach</span>
                    )}
                  </div>

                  <div className="train-capacity">
                    <div className="capacity-bar">
                      <div 
                        className="capacity-fill"
                        style={{ 
                          width: `${(train.currentPassengers / train.capacity) * 100}%`,
                          backgroundColor: crowdIndicator.color
                        }}
                      ></div>
                    </div>
                    <span className="capacity-text">
                      {train.currentPassengers} / {train.capacity} passengers
                    </span>
                  </div>

                  <div className="train-action">
                    <span>Track This Train</span>
                    <span className="arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default TrainRouteDetails;
