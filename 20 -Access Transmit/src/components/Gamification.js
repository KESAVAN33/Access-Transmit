/**
 * AccessTransit - Gamification System
 * 
 * Rewards users with points, badges, and achievements for sustainable travel.
 * Encourages accessible transit usage through gamified incentives.
 */
import React, { useState } from 'react';

const userProgress = {
  level: 7,
  currentXP: 2450,
  nextLevelXP: 3000,
  totalPoints: 12450,
  streak: 12,
  rank: 'Eco Champion'
};

const badges = [
  { id: 1, name: 'First Ride', icon: '🎫', description: 'Complete your first trip', earned: true, date: '2025-12-15' },
  { id: 2, name: 'Week Warrior', icon: '📅', description: '7-day transit streak', earned: true, date: '2025-12-22' },
  { id: 3, name: 'Eco Hero', icon: '🌱', description: 'Save 10kg CO₂', earned: true, date: '2026-01-05' },
  { id: 4, name: 'Community Helper', icon: '🤝', description: 'Submit 5 accessibility reports', earned: true, date: '2026-01-18' },
  { id: 5, name: 'Night Owl', icon: '🦉', description: 'Take 10 late-night trips', earned: false, progress: 7, target: 10 },
  { id: 6, name: 'Route Master', icon: '🗺️', description: 'Use 20 different routes', earned: false, progress: 14, target: 20 },
  { id: 7, name: 'Super Saver', icon: '💰', description: 'Save ₹5000 vs taxi', earned: false, progress: 3200, target: 5000 },
  { id: 8, name: 'Access Advocate', icon: '♿', description: 'Help 10 users with accessibility needs', earned: false, progress: 4, target: 10 }
];

const challenges = [
  { id: 1, name: 'Weekend Explorer', icon: '🎒', description: 'Take 5 trips this weekend', reward: 500, progress: 2, target: 5, endsIn: '2 days' },
  { id: 2, name: 'Green Commuter', icon: '🌿', description: 'Use transit instead of car 10 times', reward: 750, progress: 8, target: 10, endsIn: '5 days' },
  { id: 3, name: 'Accessibility Champion', icon: '❤️', description: 'Report 3 accessibility issues', reward: 400, progress: 1, target: 3, endsIn: '7 days' }
];

const leaderboard = [
  { rank: 1, name: 'Priya S.', points: 18500, avatar: '👩', badge: '🏆' },
  { rank: 2, name: 'Rahul M.', points: 16200, avatar: '👨', badge: '🥈' },
  { rank: 3, name: 'Anita K.', points: 15800, avatar: '👩', badge: '🥉' },
  { rank: 4, name: 'You', points: 12450, avatar: '⭐', badge: '', isUser: true },
  { rank: 5, name: 'Kiran R.', points: 11900, avatar: '👨', badge: '' }
];

const rewards = [
  { id: 1, name: 'Free Day Pass', icon: '🎟️', cost: 2000, available: true },
  { id: 2, name: '20% Off Monthly', icon: '💳', cost: 5000, available: true },
  { id: 3, name: 'Priority Boarding', icon: '🚀', cost: 3000, available: true },
  { id: 4, name: 'Companion Pass', icon: '👥', cost: 4000, available: false }
];

function Gamification() {
  const [activeTab, setActiveTab] = useState('overview');
  const progressPercent = (userProgress.currentXP / userProgress.nextLevelXP) * 100;

  return (
    <div className="gamification-page">
      {/* Hero Stats */}
      <div className="gamification-hero">
        <div className="level-badge">
          <span className="level-number">{userProgress.level}</span>
          <span className="level-label">LEVEL</span>
        </div>
        <div className="hero-info">
          <h1>{userProgress.rank}</h1>
          <div className="xp-bar">
            <div className="xp-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="xp-text">{userProgress.currentXP} / {userProgress.nextLevelXP} XP</p>
        </div>
        <div className="streak-badge">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{userProgress.streak}</span>
          <span className="streak-label">Day Streak</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="gamification-tabs">
        {['overview', 'badges', 'challenges', 'rewards'].map(tab => (
          <button
            key={tab}
            className={`gam-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊'}
            {tab === 'badges' && '🏅'}
            {tab === 'challenges' && '🎯'}
            {tab === 'rewards' && '🎁'}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="gamification-content">
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="qs-value">{userProgress.totalPoints.toLocaleString()}</span>
                <span className="qs-label">Total Points</span>
              </div>
              <div className="quick-stat">
                <span className="qs-value">{badges.filter(b => b.earned).length}</span>
                <span className="qs-label">Badges Earned</span>
              </div>
              <div className="quick-stat">
                <span className="qs-value">23.5 kg</span>
                <span className="qs-label">CO₂ Saved</span>
              </div>
            </div>

            {/* Active Challenges */}
            <div className="section-card">
              <h3>🎯 Active Challenges</h3>
              {challenges.slice(0, 2).map(challenge => (
                <div key={challenge.id} className="challenge-item">
                  <span className="challenge-icon">{challenge.icon}</span>
                  <div className="challenge-info">
                    <h4>{challenge.name}</h4>
                    <p>{challenge.description}</p>
                    <div className="challenge-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        ></div>
                      </div>
                      <span>{challenge.progress}/{challenge.target}</span>
                    </div>
                  </div>
                  <div className="challenge-reward">
                    <span className="reward-points">+{challenge.reward}</span>
                    <span className="reward-time">{challenge.endsIn}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Leaderboard Preview */}
            <div className="section-card">
              <h3>🏆 Leaderboard</h3>
              {leaderboard.map(entry => (
                <div 
                  key={entry.rank} 
                  className={`leaderboard-entry ${entry.isUser ? 'is-user' : ''}`}
                >
                  <span className="lb-rank">{entry.badge || `#${entry.rank}`}</span>
                  <span className="lb-avatar">{entry.avatar}</span>
                  <span className="lb-name">{entry.name}</span>
                  <span className="lb-points">{entry.points.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'badges' && (
          <div className="badges-grid">
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}
              >
                <span className="badge-icon">{badge.icon}</span>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
                {badge.earned ? (
                  <span className="earned-date">Earned {badge.date}</span>
                ) : (
                  <div className="badge-progress">
                    <div className="progress-bar small">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(badge.progress / badge.target) * 100}%` }}
                      ></div>
                    </div>
                    <span>{badge.progress}/{badge.target}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="challenges-list">
            {challenges.map(challenge => (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-header">
                  <span className="challenge-icon large">{challenge.icon}</span>
                  <div>
                    <h3>{challenge.name}</h3>
                    <p>{challenge.description}</p>
                  </div>
                </div>
                <div className="challenge-body">
                  <div className="challenge-progress">
                    <div className="progress-bar large">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      <span>{challenge.progress} / {challenge.target}</span>
                      <span className="ends-in">Ends in {challenge.endsIn}</span>
                    </div>
                  </div>
                </div>
                <div className="challenge-footer">
                  <span className="reward-badge">🎁 +{challenge.reward} Points</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rewards' && (
          <div className="rewards-section">
            <div className="points-balance">
              <span className="balance-label">Your Points</span>
              <span className="balance-value">{userProgress.totalPoints.toLocaleString()}</span>
            </div>
            <div className="rewards-grid">
              {rewards.map(reward => (
                <div 
                  key={reward.id} 
                  className={`reward-card ${!reward.available ? 'unavailable' : ''}`}
                >
                  <span className="reward-icon">{reward.icon}</span>
                  <h4>{reward.name}</h4>
                  <span className="reward-cost">{reward.cost.toLocaleString()} pts</span>
                  <button 
                    className="redeem-btn"
                    disabled={!reward.available || userProgress.totalPoints < reward.cost}
                  >
                    {userProgress.totalPoints >= reward.cost ? 'Redeem' : 'Not Enough'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gamification;
