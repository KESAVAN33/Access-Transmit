/**
 * AccessTransit - Impact Dashboard Component
 * 
 * Shows the social impact of AccessTransit:
 * - Lives improved statistics
 * - Accessibility issues resolved
 * - Community engagement metrics
 * - Real-time usage data
 * - Success stories
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Impact statistics (would be real data in production)
const impactStats = {
  totalUsers: 15234,
  accessibleTrips: 45670,
  issuesResolved: 892,
  volunteerHours: 2340,
  citiesCovered: 7,
  emergencyResponses: 156,
  caregiverConnections: 3421,
  avgResponseTime: '4.2 mins'
};

// Monthly trend data
const monthlyData = [
  { month: 'Sept', trips: 3200, issues: 45, users: 8900 },
  { month: 'Oct', trips: 4100, issues: 62, users: 10200 },
  { month: 'Nov', trips: 5400, issues: 78, users: 12100 },
  { month: 'Dec', trips: 6200, issues: 89, users: 13400 },
  { month: 'Jan', trips: 7100, issues: 95, users: 14500 },
  { month: 'Feb', trips: 8200, issues: 112, users: 15234 }
];

// Community leaderboard
const communityLeaders = [
  { rank: 1, name: 'Volunteer Priya', points: 2450, badge: '🏆', contributions: 'Reported 45 issues, Helped 120 users' },
  { rank: 2, name: 'Helper Raj', points: 2100, badge: '🥈', contributions: 'Verified 89 reports, 50 SOS responses' },
  { rank: 3, name: 'Guide Meena', points: 1890, badge: '🥉', contributions: 'Added 30 accessibility reviews' },
  { rank: 4, name: 'Scout Kumar', points: 1650, badge: '⭐', contributions: 'Mapped 15 accessible routes' },
  { rank: 5, name: 'Angel Lakshmi', points: 1420, badge: '⭐', contributions: 'Caregiver support for 25 families' }
];

// Success stories
const successStories = [
  {
    id: 1,
    name: 'Lakshmi, 72',
    city: 'Coimbatore',
    story: 'After my hip surgery, I was afraid to travel alone. AccessTransit\'s real-time tracking gives my daughter peace of mind, and the wheelchair-accessible route finder changed my life.',
    image: '👵',
    impact: 'Now travels independently 3x per week'
  },
  {
    id: 2,
    name: 'Arjun, 28',
    city: 'Chennai',
    story: 'As a visually impaired person, audio announcements and the voice assistant feature help me navigate buses confidently. The community reports about broken tactile paths save me from accidents.',
    image: '👨',
    impact: 'Reduced commute anxiety by 80%'
  },
  {
    id: 3,
    name: 'Meera & son Advaith',
    city: 'Bangalore',
    story: 'My son uses a wheelchair. Before AccessTransit, every trip was stressful - not knowing if buses had ramps. Now I plan trips confidently with real-time accessibility info.',
    image: '👩‍👦',
    impact: 'Family outings increased 5x'
  }
];

// SDG alignments
const sdgGoals = [
  { id: 3, name: 'Good Health', icon: '🏥', description: 'Enabling healthcare access for disabled & elderly' },
  { id: 10, name: 'Reduced Inequalities', icon: '⚖️', description: 'Equal transportation for all abilities' },
  { id: 11, name: 'Sustainable Cities', icon: '🏙️', description: 'Inclusive urban mobility solutions' },
  { id: 17, name: 'Partnerships', icon: '🤝', description: 'Community-driven accessibility reporting' }
];

// City-wise impact
const cityImpact = [
  { city: 'Coimbatore', users: 4521, trips: 12340, rating: 4.8 },
  { city: 'Chennai', users: 5234, trips: 15670, rating: 4.7 },
  { city: 'Bangalore', users: 2890, trips: 8920, rating: 4.6 },
  { city: 'Hyderabad', users: 1234, trips: 4560, rating: 4.5 },
  { city: 'Mumbai', users: 890, trips: 2340, rating: 4.4 },
  { city: 'Delhi', users: 345, trips: 1230, rating: 4.3 },
  { city: 'Kolkata', users: 120, trips: 610, rating: 4.5 }
];

function ImpactDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    accessibleTrips: 0,
    issuesResolved: 0
  });

  // Animate stats on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        totalUsers: Math.floor(impactStats.totalUsers * progress),
        accessibleTrips: Math.floor(impactStats.accessibleTrips * progress),
        issuesResolved: Math.floor(impactStats.issuesResolved * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="impact-dashboard-page">
      {/* Header */}
      <header className="impact-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>📊 Social Impact</h1>
        <button className="share-btn">📤 Share</button>
      </header>

      {/* Hero Stats */}
      <section className="hero-impact">
        <div className="impact-hero-card">
          <h2>Making Transit Accessible for Everyone</h2>
          <p className="tagline">Real impact, real lives changed</p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.totalUsers.toLocaleString()}+</span>
              <span className="stat-label">Users Empowered</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.accessibleTrips.toLocaleString()}+</span>
              <span className="stat-label">Accessible Trips</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{animatedStats.issuesResolved.toLocaleString()}+</span>
              <span className="stat-label">Issues Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="impact-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          Stories
        </button>
        <button 
          className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          Community
        </button>
        <button 
          className={`tab-btn ${activeTab === 'cities' ? 'active' : ''}`}
          onClick={() => setActiveTab('cities')}
        >
          Cities
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="tab-content overview-content">
          {/* Key Metrics Grid */}
          <section className="metrics-grid">
            <div className="metric-card">
              <span className="metric-icon">🚌</span>
              <span className="metric-value">{impactStats.accessibleTrips.toLocaleString()}</span>
              <span className="metric-label">Accessible Trips Completed</span>
            </div>
            <div className="metric-card">
              <span className="metric-icon">🆘</span>
              <span className="metric-value">{impactStats.emergencyResponses}</span>
              <span className="metric-label">Emergency Responses</span>
            </div>
            <div className="metric-card">
              <span className="metric-icon">👨‍👩‍👧</span>
              <span className="metric-value">{impactStats.caregiverConnections.toLocaleString()}</span>
              <span className="metric-label">Caregiver Connections</span>
            </div>
            <div className="metric-card">
              <span className="metric-icon">⏱️</span>
              <span className="metric-value">{impactStats.avgResponseTime}</span>
              <span className="metric-label">Avg Emergency Response</span>
            </div>
            <div className="metric-card">
              <span className="metric-icon">🏙️</span>
              <span className="metric-value">{impactStats.citiesCovered}</span>
              <span className="metric-label">Cities Covered</span>
            </div>
            <div className="metric-card">
              <span className="metric-icon">🤝</span>
              <span className="metric-value">{impactStats.volunteerHours.toLocaleString()}</span>
              <span className="metric-label">Volunteer Hours</span>
            </div>
          </section>

          {/* Growth Chart */}
          <section className="growth-section">
            <h3>📈 Growth Over Time</h3>
            <div className="simple-chart">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ height: `${(data.users / 16000) * 100}%` }}
                  >
                    <span className="bar-value">{(data.users / 1000).toFixed(1)}k</span>
                  </div>
                  <span className="bar-label">{data.month}</span>
                </div>
              ))}
            </div>
            <p className="chart-caption">Active users per month</p>
          </section>

          {/* SDG Alignment */}
          <section className="sdg-section">
            <h3>🌍 UN Sustainable Development Goals</h3>
            <p className="sdg-subtitle">AccessTransit contributes to these global goals</p>
            <div className="sdg-grid">
              {sdgGoals.map(goal => (
                <div key={goal.id} className="sdg-card">
                  <span className="sdg-icon">{goal.icon}</span>
                  <span className="sdg-number">SDG {goal.id}</span>
                  <span className="sdg-name">{goal.name}</span>
                  <p className="sdg-desc">{goal.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Problem Statement */}
          <section className="problem-section">
            <h3>🎯 The Problem We're Solving</h3>
            <div className="problem-stats">
              <div className="problem-item">
                <span className="big-number">2.2B</span>
                <span className="problem-text">People worldwide with disabilities</span>
              </div>
              <div className="problem-item">
                <span className="big-number">70%</span>
                <span className="problem-text">Face transportation barriers daily</span>
              </div>
              <div className="problem-item">
                <span className="big-number">15%</span>
                <span className="problem-text">Of India's population is elderly/disabled</span>
              </div>
            </div>
            <p className="solution-text">
              AccessTransit bridges this gap with real-time accessibility information, 
              emergency support, caregiver connectivity, and community-driven reporting.
            </p>
          </section>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="tab-content stories-content">
          <h3>💬 Real Stories, Real Impact</h3>
          <div className="stories-list">
            {successStories.map(story => (
              <div key={story.id} className="story-card">
                <div className="story-header">
                  <span className="story-avatar">{story.image}</span>
                  <div>
                    <h4>{story.name}</h4>
                    <span className="story-city">📍 {story.city}</span>
                  </div>
                </div>
                <blockquote className="story-quote">
                  "{story.story}"
                </blockquote>
                <div className="story-impact">
                  <span className="impact-icon">✨</span>
                  <span className="impact-text">{story.impact}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="share-story-cta">
            <h4>Have a story to share?</h4>
            <button className="share-story-btn">📝 Share Your Story</button>
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === 'community' && (
        <div className="tab-content community-content">
          <h3>🏆 Community Champions</h3>
          <p className="community-subtitle">Top contributors making transit accessible</p>
          
          <div className="leaderboard">
            {communityLeaders.map(leader => (
              <div key={leader.rank} className={`leader-card rank-${leader.rank}`}>
                <span className="rank-badge">{leader.badge}</span>
                <div className="leader-info">
                  <h4>{leader.name}</h4>
                  <p className="leader-contributions">{leader.contributions}</p>
                </div>
                <span className="leader-points">{leader.points} pts</span>
              </div>
            ))}
          </div>

          <section className="how-to-contribute">
            <h3>🤝 How You Can Help</h3>
            <div className="contribute-grid">
              <div className="contribute-card">
                <span className="contribute-icon">📝</span>
                <h4>Report Issues</h4>
                <p>Flag broken elevators, blocked ramps, and more</p>
              </div>
              <div className="contribute-card">
                <span className="contribute-icon">✓</span>
                <h4>Verify Reports</h4>
                <p>Confirm or update existing accessibility reports</p>
              </div>
              <div className="contribute-card">
                <span className="contribute-icon">🆘</span>
                <h4>Be a Helper</h4>
                <p>Respond to SOS alerts in your area</p>
              </div>
              <div className="contribute-card">
                <span className="contribute-icon">⭐</span>
                <h4>Rate Accessibility</h4>
                <p>Rate stops and stations for accessibility</p>
              </div>
            </div>
          </section>

          <div className="volunteer-cta">
            <h4>Join Our Volunteer Network</h4>
            <p>Get trained to help users with accessibility needs</p>
            <button className="volunteer-btn">👋 Sign Up as Volunteer</button>
          </div>
        </div>
      )}

      {/* Cities Tab */}
      {activeTab === 'cities' && (
        <div className="tab-content cities-content">
          <h3>🏙️ Impact by City</h3>
          
          <div className="cities-list">
            {cityImpact.map((city, idx) => (
              <div key={city.city} className="city-impact-card">
                <div className="city-rank">#{idx + 1}</div>
                <div className="city-info">
                  <h4>{city.city}</h4>
                  <div className="city-stats">
                    <span>👥 {city.users.toLocaleString()} users</span>
                    <span>🚌 {city.trips.toLocaleString()} trips</span>
                    <span>⭐ {city.rating}</span>
                  </div>
                </div>
                <div className="city-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${(city.users / 5500) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <section className="expansion-plans">
            <h3>🚀 Expansion Roadmap</h3>
            <div className="roadmap-timeline">
              <div className="roadmap-item completed">
                <span className="roadmap-dot">✓</span>
                <div className="roadmap-content">
                  <h4>Phase 1: South India</h4>
                  <p>Coimbatore, Chennai, Bangalore - Completed</p>
                </div>
              </div>
              <div className="roadmap-item current">
                <span className="roadmap-dot">⏳</span>
                <div className="roadmap-content">
                  <h4>Phase 2: Metro Cities</h4>
                  <p>Hyderabad, Mumbai, Delhi, Kolkata - In Progress</p>
                </div>
              </div>
              <div className="roadmap-item upcoming">
                <span className="roadmap-dot">○</span>
                <div className="roadmap-content">
                  <h4>Phase 3: Tier 2 Cities</h4>
                  <p>Pune, Ahmedabad, Jaipur - Q3 2026</p>
                </div>
              </div>
              <div className="roadmap-item upcoming">
                <span className="roadmap-dot">○</span>
                <div className="roadmap-content">
                  <h4>Phase 4: Pan India</h4>
                  <p>All state capitals - Q1 2027</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Call to Action */}
      <section className="impact-cta">
        <h3>Be Part of the Change</h3>
        <p>Every report, every trip, every connection makes a difference</p>
        <div className="cta-buttons">
          <button 
            className="cta-btn primary"
            onClick={() => navigate('/reports')}
          >
            📝 Report an Issue
          </button>
          <button 
            className="cta-btn secondary"
            onClick={() => navigate('/')}
          >
            🚌 Plan Accessible Trip
          </button>
        </div>
      </section>
    </div>
  );
}

export default ImpactDashboard;
