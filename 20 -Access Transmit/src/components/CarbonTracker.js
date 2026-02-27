/**
 * AccessTransit - Carbon Tracker
 * 
 * Tracks environmental impact of using public transit.
 * Shows CO₂ savings, trees equivalent, and environmental goals.
 */
import React, { useState } from 'react';

const carbonData = {
  totalSaved: 156.8,
  thisMonth: 23.5,
  thisWeek: 5.2,
  treesEquivalent: 7.2,
  tripsCount: 47,
  distanceTraveled: 342
};

const monthlyData = [
  { month: 'Sep', saved: 18.2 },
  { month: 'Oct', saved: 21.5 },
  { month: 'Nov', saved: 24.8 },
  { month: 'Dec', saved: 22.1 },
  { month: 'Jan', saved: 26.7 },
  { month: 'Feb', saved: 23.5 }
];

const comparisons = [
  { icon: '🚗', label: 'vs Car', saved: '156.8 kg CO₂', percent: 78 },
  { icon: '🛵', label: 'vs Scooter', saved: '89.2 kg CO₂', percent: 45 },
  { icon: '🚕', label: 'vs Taxi/Uber', saved: '198.4 kg CO₂', percent: 85 }
];

const achievements = [
  { id: 1, icon: '🌱', name: 'First Green Mile', description: 'Save 1kg CO₂', unlocked: true, date: 'Dec 15, 2025' },
  { id: 2, icon: '🌳', name: 'Tree Planter', description: 'Save equivalent of 1 tree', unlocked: true, date: 'Dec 28, 2025' },
  { id: 3, icon: '🌍', name: 'Eco Warrior', description: 'Save 50kg CO₂', unlocked: true, date: 'Jan 20, 2026' },
  { id: 4, icon: '🏔️', name: 'Climate Champion', description: 'Save 100kg CO₂', unlocked: true, date: 'Feb 10, 2026' },
  { id: 5, icon: '🌏', name: 'Planet Protector', description: 'Save 250kg CO₂', unlocked: false, progress: 156.8, target: 250 },
  { id: 6, icon: '🦸', name: 'Carbon Hero', description: 'Save 500kg CO₂', unlocked: false, progress: 156.8, target: 500 }
];

const tips = [
  { icon: '🚃', text: 'Taking the metro saves 3x more CO₂ than buses' },
  { icon: '⏰', text: 'Off-peak travel reduces your carbon footprint by 15%' },
  { icon: '🚶', text: 'Walking to bus stops adds extra eco-points' }
];

function CarbonTracker() {
  const [showDetails, setShowDetails] = useState(false);
  const maxMonthly = Math.max(...monthlyData.map(d => d.saved));

  return (
    <div className="carbon-tracker-page">
      {/* Hero Section */}
      <div className="carbon-hero">
        <div className="earth-animation">
          <span className="earth-emoji">🌍</span>
          <div className="orbit-ring"></div>
          <span className="leaf-particle">🍃</span>
        </div>
        <div className="hero-stats">
          <h1>
            <span className="big-number">{carbonData.totalSaved}</span>
            <span className="unit">kg CO₂</span>
          </h1>
          <p>Total Carbon Saved</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="carbon-quick-stats">
        <div className="carbon-quick-stat">
          <span className="cqs-icon">📅</span>
          <span className="cqs-value">{carbonData.thisMonth} kg</span>
          <span className="cqs-label">This Month</span>
        </div>
        <div className="carbon-quick-stat">
          <span className="cqs-icon">🌳</span>
          <span className="cqs-value">{carbonData.treesEquivalent}</span>
          <span className="cqs-label">Trees Equivalent</span>
        </div>
        <div className="carbon-quick-stat">
          <span className="cqs-icon">🚌</span>
          <span className="cqs-value">{carbonData.tripsCount}</span>
          <span className="cqs-label">Green Trips</span>
        </div>
        <div className="carbon-quick-stat">
          <span className="cqs-icon">📍</span>
          <span className="cqs-value">{carbonData.distanceTraveled} km</span>
          <span className="cqs-label">Distance</span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="section-card">
        <h3>📊 Monthly Savings</h3>
        <div className="monthly-chart">
          {monthlyData.map((data, i) => (
            <div key={i} className="month-bar-container">
              <div 
                className="month-bar"
                style={{ height: `${(data.saved / maxMonthly) * 100}%` }}
              >
                <span className="bar-tooltip">{data.saved} kg</span>
              </div>
              <span className="month-label">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="section-card">
        <h3>🔄 Compared to Other Transport</h3>
        <div className="comparison-list">
          {comparisons.map((comp, i) => (
            <div key={i} className="comparison-item">
              <span className="comp-icon">{comp.icon}</span>
              <div className="comp-info">
                <span className="comp-label">{comp.label}</span>
                <div className="comp-bar">
                  <div 
                    className="comp-fill"
                    style={{ width: `${comp.percent}%` }}
                  ></div>
                </div>
              </div>
              <span className="comp-value">{comp.saved}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="impact-visual-card">
        <h3>🌿 Your Environmental Impact</h3>
        <div className="impact-visuals">
          <div className="impact-item">
            <div className="trees-visual">
              {[...Array(Math.min(7, Math.floor(carbonData.treesEquivalent)))].map((_, i) => (
                <span key={i} className="tree-icon">🌳</span>
              ))}
            </div>
            <p>Equivalent to planting <strong>{carbonData.treesEquivalent} trees</strong></p>
          </div>
          <div className="impact-item">
            <div className="car-visual">
              <span className="car-icon">🚗</span>
              <span className="cross">❌</span>
              <span className="distance">{Math.round(carbonData.totalSaved * 4)} km</span>
            </div>
            <p>Car trips avoided</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="section-card">
        <h3>🏆 Green Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(ach => (
            <div 
              key={ach.id} 
              className={`achievement-card ${ach.unlocked ? 'unlocked' : 'locked'}`}
            >
              <span className="ach-icon">{ach.icon}</span>
              <h4>{ach.name}</h4>
              <p>{ach.description}</p>
              {ach.unlocked ? (
                <span className="ach-date">✓ {ach.date}</span>
              ) : (
                <div className="ach-progress">
                  <div className="progress-bar small">
                    <div 
                      className="progress-fill green"
                      style={{ width: `${(ach.progress / ach.target) * 100}%` }}
                    ></div>
                  </div>
                  <span>{Math.round((ach.progress / ach.target) * 100)}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Eco Tips */}
      <div className="eco-tips-card">
        <h3>💡 Eco Tips</h3>
        {tips.map((tip, i) => (
          <div key={i} className="eco-tip">
            <span className="tip-icon">{tip.icon}</span>
            <span className="tip-text">{tip.text}</span>
          </div>
        ))}
      </div>

      {/* Share Impact */}
      <div className="share-card">
        <h3>📤 Share Your Impact</h3>
        <p>Inspire others to go green!</p>
        <div className="share-buttons">
          <button className="share-btn twitter">🐦 Twitter</button>
          <button className="share-btn whatsapp">💬 WhatsApp</button>
          <button className="share-btn linkedin">💼 LinkedIn</button>
        </div>
      </div>

      {/* SDG Alignment */}
      <div className="sdg-alignment-card">
        <h3>🌐 UN SDG Alignment</h3>
        <div className="sdg-badges">
          <div className="sdg-badge" title="SDG 11: Sustainable Cities">
            <span>11</span>
            <small>Sustainable Cities</small>
          </div>
          <div className="sdg-badge" title="SDG 13: Climate Action">
            <span>13</span>
            <small>Climate Action</small>
          </div>
          <div className="sdg-badge" title="SDG 10: Reduced Inequalities">
            <span>10</span>
            <small>Reduced Inequalities</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarbonTracker;
