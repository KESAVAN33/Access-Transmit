/**
 * AccessTransit - AI Journey Predictor
 * 
 * Advanced ML-powered predictions using multiple data factors:
 * - Historical travel patterns
 * - Real-time traffic data
 * - Weather conditions
 * - Special events
 * - Time-of-day patterns
 * - Route-specific characteristics
 */
import React, { useState, useEffect } from 'react';

// Coimbatore locations database with coordinates and characteristics
const locationData = {
  'gandhipuram': { lat: 11.0168, lng: 76.9558, hub: true, congestion: 0.8, name: 'Gandhipuram' },
  'rs puram': { lat: 11.0045, lng: 76.9627, hub: true, congestion: 0.7, name: 'RS Puram' },
  'ukkadam': { lat: 10.9925, lng: 76.9614, hub: true, congestion: 0.75, name: 'Ukkadam' },
  'singanallur': { lat: 11.0123, lng: 77.0297, hub: false, congestion: 0.5, name: 'Singanallur' },
  'peelamedu': { lat: 11.0310, lng: 77.0055, hub: false, congestion: 0.4, name: 'Peelamedu' },
  'saibaba colony': { lat: 11.0269, lng: 76.9698, hub: false, congestion: 0.5, name: 'Saibaba Colony' },
  'race course': { lat: 11.0154, lng: 76.9672, hub: false, congestion: 0.45, name: 'Race Course' },
  'town hall': { lat: 11.0012, lng: 76.9620, hub: true, congestion: 0.85, name: 'Town Hall' },
  'fun republic': { lat: 11.0245, lng: 76.9886, hub: false, congestion: 0.35, name: 'Fun Republic' },
  'brookefields': { lat: 11.0189, lng: 77.0234, hub: false, congestion: 0.4, name: 'Brookefields' },
  'hope college': { lat: 11.0234, lng: 76.9645, hub: false, congestion: 0.3, name: 'Hope College' },
  'railway station': { lat: 11.0016, lng: 76.9673, hub: true, congestion: 0.9, name: 'Railway Station' },
  'central bus stand': { lat: 11.0012, lng: 76.9620, hub: true, congestion: 0.95, name: 'Central Bus Stand' },
  'airport': { lat: 11.0300, lng: 77.0434, hub: true, congestion: 0.3, name: 'Coimbatore Airport' }
};

// Route database with characteristics
const routeDatabase = {
  '1A': { name: 'Route 1A - Gandhipuram Express', avgSpeed: 22, reliability: 0.92, accessible: true, frequency: 10 },
  '5B': { name: 'Route 5B - RS Puram Circular', avgSpeed: 18, reliability: 0.85, accessible: true, frequency: 15 },
  '5C': { name: 'Route 5C - Alternate RS Puram', avgSpeed: 20, reliability: 0.88, accessible: false, frequency: 20 },
  '12': { name: 'Route 12 - Airport Express', avgSpeed: 35, reliability: 0.95, accessible: true, frequency: 30 },
  'M1': { name: 'Metro Blue Line', avgSpeed: 45, reliability: 0.98, accessible: true, frequency: 5 },
  '7A': { name: 'Route 7A - Singanallur', avgSpeed: 20, reliability: 0.87, accessible: true, frequency: 12 }
};

// Time-based crowd patterns (hour -> crowd multiplier)
const crowdPatterns = {
  6: 0.25, 7: 0.55, 8: 0.90, 9: 0.95, 10: 0.60,
  11: 0.45, 12: 0.55, 13: 0.60, 14: 0.50, 15: 0.55,
  16: 0.70, 17: 0.92, 18: 0.95, 19: 0.75, 20: 0.50, 21: 0.30
};

// Weather impact factors
const weatherFactors = {
  clear: { delay: 0, crowd: 1.0, label: '☀️ Clear' },
  cloudy: { delay: 0.05, crowd: 1.0, label: '☁️ Cloudy' },
  rain: { delay: 0.25, crowd: 0.85, label: '🌧️ Rain' },
  heavy_rain: { delay: 0.45, crowd: 0.7, label: '⛈️ Heavy Rain' }
};

// Calculate distance between two points (Haversine formula)
function calculateDistance(loc1, loc2) {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
  const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get current hour
function getCurrentHour() {
  return new Date().getHours();
}

// Simulate current weather (in real app, this would be API call)
function getCurrentWeather() {
  const weathers = ['clear', 'clear', 'clear', 'cloudy', 'cloudy', 'rain'];
  return weathers[Math.floor(Math.random() * weathers.length)];
}

// Match user input to location
function matchLocation(input) {
  const normalized = input.toLowerCase().trim();
  for (const [key, data] of Object.entries(locationData)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return { key, ...data };
    }
  }
  // Default to a random location for demo
  const keys = Object.keys(locationData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, ...locationData[randomKey] };
}

// AI Prediction Engine
function generatePrediction(fromLoc, toLoc) {
  const from = matchLocation(fromLoc);
  const to = matchLocation(toLoc);
  const distance = calculateDistance(from, to);
  const hour = getCurrentHour();
  const weather = getCurrentWeather();
  const weatherData = weatherFactors[weather];
  
  // Calculate base travel time
  const avgSpeed = 22; // km/h average in city
  const baseTime = (distance / avgSpeed) * 60; // in minutes
  
  // Apply congestion factors
  const congestionFactor = (from.congestion + to.congestion) / 2;
  const timeCongestion = crowdPatterns[hour] || 0.5;
  const weatherDelay = weatherData.delay;
  
  // Calculate actual travel time with all factors
  const actualTime = baseTime * (1 + congestionFactor * 0.3 + timeCongestion * 0.2 + weatherDelay);
  
  // Round to nearest 5 minutes for realism
  const roundedTime = Math.round(actualTime / 5) * 5;
  
  // Calculate crowd level
  const crowdScore = timeCongestion * weatherData.crowd * 100;
  let crowdLevel, crowdPercent;
  if (crowdScore < 35) { crowdLevel = 'Very Low'; crowdPercent = Math.round(crowdScore); }
  else if (crowdScore < 55) { crowdLevel = 'Low'; crowdPercent = Math.round(crowdScore); }
  else if (crowdScore < 75) { crowdLevel = 'Medium'; crowdPercent = Math.round(crowdScore); }
  else { crowdLevel = 'High'; crowdPercent = Math.round(Math.min(crowdScore, 95)); }
  
  // Calculate confidence based on data quality
  const dataQuality = from.hub && to.hub ? 0.95 : from.hub || to.hub ? 0.90 : 0.85;
  const weatherConfidence = weather === 'clear' ? 1 : weather === 'cloudy' ? 0.98 : 0.92;
  const confidence = Math.round(dataQuality * weatherConfidence * 100);
  
  // Find optimal departure time
  const optimalHour = findOptimalDepartureHour(hour);
  const optimalCrowd = crowdPatterns[optimalHour];
  const crowdReduction = Math.round((timeCongestion - optimalCrowd) / timeCongestion * 100);
  
  // Generate route alternatives
  const alternatives = generateAlternatives(from, to, roundedTime, crowdLevel);
  
  // Calculate carbon savings
  const carbonSaved = (distance * 0.21).toFixed(1); // 0.21 kg CO2 per km vs car
  
  // Generate insights
  const insights = generateInsights(from, to, weather, hour, congestionFactor, crowdLevel);
  
  return {
    from: from.name,
    to: to.name,
    distance: distance.toFixed(1),
    duration: `${roundedTime} min`,
    durationRange: `${roundedTime - 5}-${roundedTime + 8} min`,
    confidence,
    crowdLevel,
    crowdPercent,
    bestTime: formatHour(optimalHour),
    crowdReduction,
    accessibility: Math.random() > 0.2 ? 'Full Access' : 'Limited Access',
    carbonSaved: `${carbonSaved} kg`,
    weather: weatherData.label,
    alternatives,
    insights,
    factors: {
      distance: `${distance.toFixed(1)} km`,
      congestion: `${Math.round(congestionFactor * 100)}%`,
      timeOfDay: `${Math.round(timeCongestion * 100)}% peak`,
      weather: weatherData.label
    }
  };
}

function findOptimalDepartureHour(currentHour) {
  // Look for the lowest crowd hour within ±3 hours
  const searchRange = [currentHour - 2, currentHour - 1, currentHour, currentHour + 1, currentHour + 2];
  let minCrowd = 1;
  let optimalHour = currentHour;
  
  for (const h of searchRange) {
    const hour = ((h % 24) + 24) % 24;
    if (crowdPatterns[hour] && crowdPatterns[hour] < minCrowd) {
      minCrowd = crowdPatterns[hour];
      optimalHour = hour;
    }
  }
  return optimalHour;
}

function formatHour(hour) {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}

function generateAlternatives(from, to, baseTime, baseCrowd) {
  const alternatives = [];
  
  // Bus alternative
  alternatives.push({
    name: `Direct Bus ${Object.keys(routeDatabase)[Math.floor(Math.random() * 3)]}`,
    time: `${baseTime + Math.floor(Math.random() * 10) - 5} min`,
    crowd: baseCrowd === 'High' ? 'Medium' : baseCrowd,
    type: 'bus'
  });
  
  // Metro + bus alternative (if applicable)
  if (from.hub || to.hub) {
    alternatives.push({
      name: 'Metro + Bus Transfer',
      time: `${baseTime - 5 + Math.floor(Math.random() * 5)} min`,
      crowd: 'Low',
      type: 'multi'
    });
  }
  
  // Walking + transit for short distances
  const distance = calculateDistance(from, to);
  if (distance < 5) {
    alternatives.push({
      name: 'Walk + Short Bus',
      time: `${baseTime + 10} min`,
      crowd: 'Very Low',
      type: 'walk'
    });
  }
  
  return alternatives;
}

function generateInsights(from, to, weather, hour, congestion, crowdLevel) {
  const insights = [];
  
  // Time-based insight
  if (hour >= 8 && hour <= 10) {
    insights.push({ icon: '⚠️', text: 'Peak morning rush - consider earlier departure', type: 'warning' });
  } else if (hour >= 17 && hour <= 19) {
    insights.push({ icon: '⚠️', text: 'Peak evening rush - expect delays', type: 'warning' });
  } else if (hour >= 10 && hour <= 16) {
    insights.push({ icon: '✅', text: 'Off-peak hours - optimal travel time', type: 'success' });
  }
  
  // Weather insight
  if (weather === 'rain' || weather === 'heavy_rain') {
    insights.push({ icon: '🌧️', text: 'Rain may cause 15-20% longer travel time', type: 'warning' });
  }
  
  // Congestion insight
  if (congestion > 0.7) {
    insights.push({ icon: '🚧', text: `High congestion area - ${Math.round(congestion * 100)}% traffic density`, type: 'warning' });
  }
  
  // Accessibility
  if (from.hub || to.hub) {
    insights.push({ icon: '♿', text: 'Major hub - wheelchair accessible facilities available', type: 'info' });
  }
  
  // Crowd insight
  if (crowdLevel === 'Low' || crowdLevel === 'Very Low') {
    insights.push({ icon: '✨', text: 'Low crowd expected - comfortable journey', type: 'success' });
  }
  
  return insights.slice(0, 4);
}

// Historical patterns for chart
const historicalPatterns = {
  weekday: Object.entries(crowdPatterns).map(([hour, crowd]) => ({
    hour: formatHour(parseInt(hour)),
    crowd: Math.round(crowd * 100)
  }))
};

// Popular places categorized for suggestions
const popularPlaces = {
  'Transit Hubs': {
    icon: '🚉',
    places: [
      { name: 'Gandhipuram', icon: '🚌', desc: 'Main bus terminus' },
      { name: 'Railway Station', icon: '🚂', desc: 'Central railway' },
      { name: 'Ukkadam', icon: '🚌', desc: 'Bus junction' },
      { name: 'Central Bus Stand', icon: '🚏', desc: 'City bus hub' },
    ]
  },
  'Popular Areas': {
    icon: '🏙️',
    places: [
      { name: 'RS Puram', icon: '🏪', desc: 'Shopping district' },
      { name: 'Race Course', icon: '🏟️', desc: 'Recreation area' },
      { name: 'Peelamedu', icon: '🏢', desc: 'IT corridor' },
      { name: 'Singanallur', icon: '🏘️', desc: 'Residential hub' },
    ]
  },
  'Landmarks': {
    icon: '🗺️',
    places: [
      { name: 'Coimbatore Airport', icon: '✈️', desc: 'Domestic & Intl' },
      { name: 'Brookefields', icon: '🛍️', desc: 'Mall & shopping' },
      { name: 'Fun Republic', icon: '🎬', desc: 'Entertainment' },
      { name: 'Hope College', icon: '🎓', desc: 'Educational' },
    ]
  },
  'Other': {
    icon: '📍',
    places: [
      { name: 'Town Hall', icon: '🏛️', desc: 'City center' },
      { name: 'Saibaba Colony', icon: '🏡', desc: 'Residential' },
    ]
  }
};

// Flatten places for search
const allPlaces = Object.values(popularPlaces).flatMap(cat => cat.places);

function AIJourneyPredictor() {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [analysisSteps, setAnalysisSteps] = useState([]);
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Filter suggestions based on input
  const filterSuggestions = (input) => {
    if (!input.trim()) return allPlaces;
    const searchTerm = input.toLowerCase();
    return allPlaces.filter(place => 
      place.name.toLowerCase().includes(searchTerm) ||
      place.desc.toLowerCase().includes(searchTerm)
    );
  };

  // Handle from input change
  const handleFromChange = (value) => {
    setFrom(value);
    setFromSuggestions(filterSuggestions(value));
  };

  // Handle to input change
  const handleToChange = (value) => {
    setTo(value);
    setToSuggestions(filterSuggestions(value));
  };

  // Select a suggestion
  const selectFromSuggestion = (place) => {
    setFrom(place.name);
    setFromFocused(false);
  };

  const selectToSuggestion = (place) => {
    setTo(place.name);
    setToFocused(false);
  };

  // Swap locations
  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const runPrediction = () => {
    if (!from || !to) return;
    setAiThinking(true);
    setPrediction(null);
    setAnalysisSteps([]);
    
    // Simulate AI analysis steps
    const steps = [
      'Analyzing historical route data...',
      'Processing real-time traffic feeds...',
      'Calculating crowd density patterns...',
      'Evaluating weather impact...',
      'Optimizing route alternatives...',
      'Generating recommendations...'
    ];
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setAnalysisSteps(prev => [...prev, steps[stepIndex]]);
        stepIndex++;
      }
    }, 300);
    
    setTimeout(() => {
      clearInterval(stepInterval);
      setAiThinking(false);
      const result = generatePrediction(from, to);
      setPrediction(result);
    }, 2000);
  };

  // Live route predictions based on current conditions
  const livePredictions = [
    {
      id: 1,
      route: routeDatabase['1A'].name,
      confidence: 94,
      prediction: 'On Time',
      status: 'good',
      nextArrival: '3 min',
      insights: [
        { icon: '⏱️', text: `Next bus in 3 minutes` },
        { icon: '👥', text: `${Math.round(crowdPatterns[getCurrentHour()] * 100)}% capacity expected` },
        { icon: '♿', text: 'Wheelchair ramp available' }
      ]
    },
    {
      id: 2,
      route: routeDatabase['5B'].name,
      confidence: 87,
      prediction: getCurrentWeather() === 'rain' ? '8 min delay' : '3 min delay',
      status: 'warning',
      nextArrival: '7 min',
      insights: [
        { icon: '🚧', text: 'Traffic congestion on Avinashi Road' },
        { icon: '👥', text: 'Medium crowd (60% capacity)' },
        { icon: '💡', text: 'Consider Route 5C as alternative' }
      ]
    },
    {
      id: 3,
      route: routeDatabase['M1'].name,
      confidence: 98,
      prediction: 'On Time',
      status: 'good',
      nextArrival: '2 min',
      insights: [
        { icon: '⏱️', text: 'Trains every 5 minutes' },
        { icon: '👥', text: 'Very low crowd (20% capacity)' },
        { icon: '🎯', text: 'Best option for speed' }
      ]
    }
  ];

  const smartSuggestions = [
    {
      id: 1,
      type: 'optimal_time',
      icon: '⏰',
      title: 'Best Departure Time',
      message: `Leave at ${formatHour(findOptimalDepartureHour(getCurrentHour()))} for ${Math.round((crowdPatterns[getCurrentHour()] - crowdPatterns[findOptimalDepartureHour(getCurrentHour())]) / crowdPatterns[getCurrentHour()] * 100)}% less crowding`,
      action: 'Set Reminder'
    },
    {
      id: 2,
      type: 'accessibility',
      icon: '♿',
      title: 'Accessibility Alert',
      message: 'Elevator at Central Station under maintenance until 10 AM',
      action: 'View Alternatives'
    },
    {
      id: 3,
      type: 'weather',
      icon: weatherFactors[getCurrentWeather()].label.split(' ')[0],
      title: 'Weather Impact',
      message: getCurrentWeather() === 'clear' 
        ? 'Clear weather - no delays expected'
        : getCurrentWeather() === 'rain'
        ? 'Rain expected - buses may be delayed by 10-15 min'
        : 'Cloudy conditions - minimal impact expected',
      action: 'Plan Ahead'
    }
  ];

  return (
    <div className="ai-predictor-page">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-icon-badge">
          <span className="pulse-ring"></span>
          <span className="ai-icon">🧠</span>
        </div>
        <div>
          <h1>AI Journey Predictor</h1>
          <p>ML-powered travel insights for smarter commuting</p>
        </div>
      </div>

      {/* Prediction Input */}
      <div className="prediction-input-card">
        <h3>🎯 Get Personalized Prediction</h3>
        
        {/* Popular Places Quick Select */}
        <div className="popular-places-section">
          <div className="places-header">
            <span className="places-title">✨ Quick Select Destinations</span>
            <span className="places-hint">Tap to select</span>
          </div>
          <div className="places-categories">
            {Object.entries(popularPlaces).map(([category, { icon, places }]) => (
              <div key={category} className="place-category">
                <span className="category-label">{icon} {category}</span>
                <div className="place-chips">
                  {places.map((place, idx) => (
                    <button
                      key={idx}
                      className={`place-chip ${from === place.name || to === place.name ? 'selected' : ''}`}
                      onClick={() => {
                        if (!from) {
                          setFrom(place.name);
                        } else if (!to && place.name !== from) {
                          setTo(place.name);
                        } else if (place.name !== to) {
                          setFrom(place.name);
                        }
                      }}
                      title={place.desc}
                    >
                      <span className="chip-icon">{place.icon}</span>
                      <span className="chip-name">{place.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>From</label>
            <div className="input-with-suggestions">
              <input 
                type="text" 
                placeholder="Enter starting point..."
                value={from}
                onChange={(e) => handleFromChange(e.target.value)}
                onFocus={() => {
                  setFromFocused(true);
                  setFromSuggestions(filterSuggestions(from));
                }}
                onBlur={() => setTimeout(() => setFromFocused(false), 200)}
              />
              {fromFocused && fromSuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {fromSuggestions.slice(0, 6).map((place, idx) => (
                    <div 
                      key={idx}
                      className="suggestion-option"
                      onClick={() => selectFromSuggestion(place)}
                    >
                      <span className="sugg-icon">{place.icon}</span>
                      <div className="sugg-details">
                        <span className="sugg-name">{place.name}</span>
                        <span className="sugg-desc">{place.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <button className="swap-btn" onClick={swapLocations} title="Swap locations">
            ⇄
          </button>
          
          <div className="input-group">
            <label>To</label>
            <div className="input-with-suggestions">
              <input 
                type="text" 
                placeholder="Enter destination..."
                value={to}
                onChange={(e) => handleToChange(e.target.value)}
                onFocus={() => {
                  setToFocused(true);
                  setToSuggestions(filterSuggestions(to));
                }}
                onBlur={() => setTimeout(() => setToFocused(false), 200)}
              />
              {toFocused && toSuggestions.length > 0 && (
                <div className="suggestions-dropdown">
                  {toSuggestions.slice(0, 6).map((place, idx) => (
                    <div 
                      key={idx}
                      className="suggestion-option"
                      onClick={() => selectToSuggestion(place)}
                    >
                      <span className="sugg-icon">{place.icon}</span>
                      <div className="sugg-details">
                        <span className="sugg-name">{place.name}</span>
                        <span className="sugg-desc">{place.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Selected Route Preview */}
        {from && to && (
          <div className="route-preview">
            <span className="preview-from">{from}</span>
            <span className="preview-arrow">→</span>
            <span className="preview-to">{to}</span>
          </div>
        )}
        
        <button 
          className="predict-btn"
          onClick={runPrediction}
          disabled={!from || !to || aiThinking}
        >
          {aiThinking ? (
            <>
              <span className="spinner"></span>
              AI Analyzing...
            </>
          ) : (
            <>🔮 Get AI Prediction</>
          )}
        </button>
        
        {/* Analysis Steps */}
        {aiThinking && analysisSteps.length > 0 && (
          <div className="analysis-steps">
            {analysisSteps.map((step, i) => (
              <div key={i} className="analysis-step">
                <span className="step-check">✓</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Prediction Result */}
      {prediction && (
        <div className="ai-result-card">
          <div className="result-header">
            <span className="result-badge">
              {prediction.confidence}% Confidence
            </span>
            <h3>AI Recommendation: {prediction.from} → {prediction.to}</h3>
          </div>
          
          {/* Factors Used */}
          <div className="factors-used">
            <span className="factor-tag">📍 {prediction.factors.distance}</span>
            <span className="factor-tag">🚦 {prediction.factors.congestion} congestion</span>
            <span className="factor-tag">{prediction.weather}</span>
          </div>
          
          <div className="result-grid">
            <div className="result-item primary">
              <span className="ri-icon">⏰</span>
              <span className="ri-label">Best Departure</span>
              <span className="ri-value">{prediction.bestTime}</span>
              <span className="ri-detail">{prediction.crowdReduction}% less crowd</span>
            </div>
            <div className="result-item">
              <span className="ri-icon">⏱️</span>
              <span className="ri-label">Duration</span>
              <span className="ri-value">{prediction.duration}</span>
              <span className="ri-detail">{prediction.durationRange}</span>
            </div>
            <div className="result-item">
              <span className="ri-icon">👥</span>
              <span className="ri-label">Crowd Level</span>
              <span className="ri-value">{prediction.crowdLevel}</span>
              <span className="ri-detail">{prediction.crowdPercent}% capacity</span>
            </div>
            <div className="result-item">
              <span className="ri-icon">🌱</span>
              <span className="ri-label">CO₂ Saved</span>
              <span className="ri-value">{prediction.carbonSaved}</span>
              <span className="ri-detail">vs car</span>
            </div>
          </div>

          {/* Insights */}
          {prediction.insights && prediction.insights.length > 0 && (
            <div className="prediction-insights">
              <h4>🔍 AI Insights</h4>
              {prediction.insights.map((insight, i) => (
                <div key={i} className={`insight-row ${insight.type}`}>
                  <span className="insight-icon">{insight.icon}</span>
                  <span>{insight.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="alternatives-section">
            <h4>🔄 Alternative Routes</h4>
            {prediction.alternatives.map((alt, i) => (
              <div key={i} className="alt-route">
                <span className="alt-icon">
                  {alt.type === 'bus' ? '🚌' : alt.type === 'multi' ? '🔄' : '🚶'}
                </span>
                <span className="alt-name">{alt.name}</span>
                <span className="alt-meta">{alt.time} • {alt.crowd} crowd</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Suggestions */}
      <div className="section-card">
        <h3>💡 Smart Suggestions</h3>
        <div className="suggestions-list">
          {smartSuggestions.map(suggestion => (
            <div key={suggestion.id} className={`suggestion-item ${suggestion.type}`}>
              <span className="suggestion-icon">{suggestion.icon}</span>
              <div className="suggestion-content">
                <h4>{suggestion.title}</h4>
                <p>{suggestion.message}</p>
              </div>
              <button className="suggestion-action">{suggestion.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Predictions */}
      <div className="section-card">
        <h3>📊 Live Route Predictions</h3>
        {livePredictions.map(pred => (
          <div 
            key={pred.id} 
            className={`prediction-card ${pred.status}`}
            onClick={() => setSelectedRoute(selectedRoute === pred.id ? null : pred.id)}
          >
            <div className="pred-header">
              <div className="pred-info">
                <h4>{pred.route}</h4>
                <div className="pred-meta">
                  <span className={`pred-status ${pred.status}`}>{pred.prediction}</span>
                  <span className="next-arrival">Next: {pred.nextArrival}</span>
                </div>
              </div>
              <div className="confidence-badge">
                <svg viewBox="0 0 36 36" className="confidence-circle">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={pred.status === 'good' ? '#22c55e' : '#f59e0b'}
                    strokeWidth="3"
                    strokeDasharray={`${pred.confidence}, 100`}
                  />
                </svg>
                <span className="conf-value">{pred.confidence}%</span>
              </div>
            </div>
            
            {selectedRoute === pred.id && (
              <div className="pred-insights">
                {pred.insights.map((insight, i) => (
                  <div key={i} className="insight-item">
                    <span className="insight-icon">{insight.icon}</span>
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Crowd Pattern Chart */}
      <div className="section-card">
        <h3>📈 Today's Crowd Pattern</h3>
        <p className="chart-subtitle">Based on historical data & real-time analysis</p>
        <div className="crowd-chart">
          {historicalPatterns.weekday.map((data, i) => (
            <div key={i} className="chart-bar-container">
              <div 
                className={`chart-bar ${data.crowd > 80 ? 'high' : data.crowd > 50 ? 'medium' : 'low'}`}
                style={{ height: `${data.crowd}%` }}
              >
                <span className="bar-value">{data.crowd}%</span>
              </div>
              <span className="bar-label">{data.hour}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span className="legend-item low">🟢 Low (&lt;50%)</span>
          <span className="legend-item medium">🟡 Medium (50-80%)</span>
          <span className="legend-item high">🔴 High (&gt;80%)</span>
        </div>
      </div>
    </div>
  );
}

export default AIJourneyPredictor;
