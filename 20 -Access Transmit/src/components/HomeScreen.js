/**
 * AccessTransit - Home Screen Component
 * 
 * The main landing page where users can:
 * - View available routes
 * - Toggle accessibility mode
 * - See quick statistics
 * - Select a route to view details
 */

import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AccessibilityContext } from '../App';
import { 
  routes, 
  trainRoutes,
  getAllBuses, 
  filterAccessibleBuses,
  getDashboardStats,
  getCrowdIndicator,
  assessRisk,
  getTrainData,
  getTrainsByRoute
} from '../data/busData';

// Get selected city from KYC/sessionStorage
function getSelectedCity() {
  try {
    const kyc = JSON.parse(window.sessionStorage.getItem('accesstransit_kyc'));
    return kyc && kyc.city ? kyc.city : null;
  } catch {
    return null;
  }
}

function HomeScreen() {
  const { accessibilityMode, toggleAccessibility } = useContext(AccessibilityContext);
  const [buses, setBuses] = useState([]);
  const [trains, setTrains] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState(getSelectedCity());
  const [transportMode, setTransportMode] = useState('bus'); // 'bus' or 'train'

  // Load and update bus/train data
  useEffect(() => {
    const updateData = () => {
      let allBuses = getAllBuses();
      // Filter by accessibility if mode is on
      allBuses = filterAccessibleBuses(allBuses, accessibilityMode);
      setBuses(allBuses);
      setTrains(getTrainData());
      setStats(getDashboardStats());
    };

    updateData();
    // Update every 3 seconds for real-time feel
    const interval = setInterval(updateData, 3000);
    return () => clearInterval(interval);
  }, [accessibilityMode]);

  // Filter routes by city and search query
  const filteredRoutes = routes.filter(route => {
    const matchesCity = !city || route.city === city;
    const matchesSearch =
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Filter train routes by city and search query
  const filteredTrainRoutes = trainRoutes.filter(route => {
    const matchesCity = !city || route.city === city;
    const matchesSearch =
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Count available buses per route (considering accessibility filter)
  const getBusCountForRoute = (routeId) => {
    return buses.filter(bus => bus.route === routeId).length;
  };

  // Count trains per route
  const getTrainCountForRoute = (routeId) => {
    return trains.filter(train => train.route === routeId).length;
  };

  // Get crowd status for a train route
  const getTrainRouteCrowdStatus = (routeId) => {
    const routeTrains = trains.filter(train => train.route === routeId);
    if (routeTrains.length === 0) return 'Unknown';
    
    const crowdCounts = { Low: 0, Medium: 0, High: 0 };
    routeTrains.forEach(train => crowdCounts[train.crowdLevel]++);
    
    if (crowdCounts.High > crowdCounts.Low && crowdCounts.High >= crowdCounts.Medium) return 'High';
    if (crowdCounts.Medium >= crowdCounts.Low) return 'Medium';
    return 'Low';
  };

  // Get crowd status for a route (averaged from buses on that route)
  const getRouteCrowdStatus = (routeId) => {
    const routeBuses = buses.filter(bus => bus.route === routeId);
    if (routeBuses.length === 0) return 'Unknown';
    
    const crowdCounts = { Low: 0, Medium: 0, High: 0 };
    routeBuses.forEach(bus => crowdCounts[bus.crowdLevel]++);
    
    if (crowdCounts.High > crowdCounts.Low && crowdCounts.High >= crowdCounts.Medium) return 'High';
    if (crowdCounts.Medium >= crowdCounts.Low) return 'Medium';
    return 'Low';
  };

  // Check if any bus on route has a high risk alert
  const routeHasAlert = (routeId) => {
    const routeBuses = buses.filter(bus => bus.route === routeId);
    return routeBuses.some(bus => {
      const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
      return risk.level === 'High';
    });
  };

  return (
    <div className="home-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to AccessTransit</h1>
          <p>Your human-centered public transport assistant</p>
          {city && (
            <div className="city-badge">
              <span className="city-icon">📍</span>
              <span className="city-name">{city}</span>
            </div>
          )}
          
          {/* Quick Stats Cards */}
          {stats && (
            <div className="quick-stats">
              <div className="stat-card">
                <span className="stat-icon">🚌</span>
                <span className="stat-value">{stats.totalBuses}</span>
                <span className="stat-label">Active Buses</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🚆</span>
                <span className="stat-value">{trains.length}</span>
                <span className="stat-label">Active Trains</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">♿</span>
                <span className="stat-value">{stats.accessibleBuses}</span>
                <span className="stat-label">Accessible</span>
              </div>
              <div className="stat-card warning">
                <span className="stat-icon">⚠️</span>
                <span className="stat-value">{stats.riskAlerts}</span>
                <span className="stat-label">Alerts</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Controls Section */}
      <section className="controls-section">
        <div className="controls-row">
          {/* Search Input */}
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search routes"
            />
          </div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="routes-section">
        {/* Transport Mode Tabs */}
        <div className="transport-tabs">
          <button 
            className={`transport-tab ${transportMode === 'bus' ? 'active' : ''}`}
            onClick={() => setTransportMode('bus')}
          >
            <span className="tab-icon">🚌</span>
            <span>Buses</span>
            <span className="tab-count">{filteredRoutes.length}</span>
          </button>
          <button 
            className={`transport-tab ${transportMode === 'train' ? 'active' : ''}`}
            onClick={() => setTransportMode('train')}
          >
            <span className="tab-icon">🚆</span>
            <span>Trains</span>
            <span className="tab-count">{filteredTrainRoutes.length}</span>
          </button>
        </div>

        <h2 className="section-title">
          {transportMode === 'bus' ? 'Select a Bus Route' : 'Select a Train Line'}
        </h2>
        
        {/* Bus Routes Grid */}
        {transportMode === 'bus' && (
          <div className="routes-grid">
            {filteredRoutes.map(route => {
              const busCount = getBusCountForRoute(route.id);
              const crowdStatus = getRouteCrowdStatus(route.id);
              const crowdIndicator = getCrowdIndicator(crowdStatus);
              const hasAlert = routeHasAlert(route.id);

              return (
                <Link 
                  to={`/route/${route.id}`} 
                  key={route.id}
                  className={`route-card ${hasAlert ? 'has-alert' : ''}`}
                  style={{ '--route-color': route.color }}
                >
                  <div className="route-header">
                    <div className="route-color-bar" style={{ backgroundColor: route.color }}></div>
                    <h3 className="route-name">{route.name}</h3>
                    {hasAlert && <span className="alert-badge">⚠️</span>}
                  </div>
                  
                  <p className="route-description">{route.description}</p>
                  
                  <div className="route-stops">
                    <span className="stops-label">Stops:</span>
                    <span className="stops-list">
                      {route.stops.slice(0, 3).join(' → ')}
                      {route.stops.length > 3 && ' ...'}
                    </span>
                  </div>
                  
                  <div className="route-stats">
                    <div className="route-stat">
                      <span className="stat-icon">🚌</span>
                      <span>{busCount} {busCount === 1 ? 'bus' : 'buses'}</span>
                    </div>
                    <div className="route-stat crowd-stat">
                      <span>{crowdIndicator.emoji}</span>
                      <span>{crowdIndicator.text}</span>
                    </div>
                  </div>

                  <div className="route-action">
                    <span>View Details</span>
                    <span className="arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Train Routes Grid */}
        {transportMode === 'train' && (
          <div className="routes-grid">
            {filteredTrainRoutes.map(route => {
              const trainCount = getTrainCountForRoute(route.id);
              const crowdStatus = getTrainRouteCrowdStatus(route.id);
              const crowdIndicator = getCrowdIndicator(crowdStatus);

              return (
                <Link 
                  to={`/train-route/${route.id}`} 
                  key={route.id}
                  className="route-card train-route"
                  style={{ '--route-color': route.color }}
                >
                  <div className="route-header">
                    <div className="route-color-bar" style={{ backgroundColor: route.color }}></div>
                    <h3 className="route-name">{route.name}</h3>
                    <span className={`train-type-badge ${route.type}`}>
                      {route.type === 'metro' ? '🚇' : route.type === 'local' ? '🚃' : '🚆'} {route.type}
                    </span>
                  </div>
                  
                  <p className="route-description">{route.description}</p>
                  
                  <div className="route-stops">
                    <span className="stops-label">Stations:</span>
                    <span className="stops-list">
                      {route.stations.slice(0, 3).join(' → ')}
                      {route.stations.length > 3 && ` ... (${route.stations.length} total)`}
                    </span>
                  </div>

                  <div className="train-frequency">
                    <span className="frequency-icon">⏱️</span>
                    <span>{route.frequency}</span>
                  </div>
                  
                  <div className="route-stats">
                    <div className="route-stat">
                      <span className="stat-icon">🚆</span>
                      <span>{trainCount} {trainCount === 1 ? 'train' : 'trains'}</span>
                    </div>
                    <div className="route-stat crowd-stat">
                      <span>{crowdIndicator.emoji}</span>
                      <span>{crowdIndicator.text}</span>
                    </div>
                  </div>

                  <div className="route-action">
                    <span>View Trains</span>
                    <span className="arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {transportMode === 'bus' && filteredRoutes.length === 0 && (
          <div className="no-results">
            <p>No bus routes found {searchQuery ? `matching "${searchQuery}"` : 'in your city'}</p>
          </div>
        )}

        {transportMode === 'train' && filteredTrainRoutes.length === 0 && (
          <div className="no-results">
            <p>No train routes found {searchQuery ? `matching "${searchQuery}"` : 'in your city'}</p>
          </div>
        )}
      </section>

      {/* Legend */}
      <section className="legend-section">
        <h3>Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-icon">🟢</span>
            <span>Low Crowd</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🟡</span>
            <span>Medium Crowd</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">🔴</span>
            <span>High Crowd</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">⚠️</span>
            <span>Safety Alert</span>
          </div>
          <div className="legend-item">
            <span className="legend-icon">♿</span>
            <span>Accessible</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeScreen;
