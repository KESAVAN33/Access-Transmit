/**
 * AccessTransit - Community Hub
 * 
 * Social features for transit users - tips, reviews, discussions.
 * Accessibility-focused community support.
 */
import React, { useState } from 'react';

const communityPosts = [
  {
    id: 1,
    author: 'Priya S.',
    avatar: '👩',
    badge: 'Verified Wheelchair User',
    time: '2 hours ago',
    content: 'The new ramp at Gandhipuram bus stand is amazing! Finally easy access without assistance. Thank you AccessTransit for advocating! 🙌',
    likes: 45,
    comments: 12,
    type: 'positive',
    tags: ['accessibility', 'wheelchair']
  },
  {
    id: 2,
    author: 'Rahul M.',
    avatar: '👨',
    badge: 'Daily Commuter',
    time: '5 hours ago',
    content: 'Pro tip: Route 5B has less crowd between 10-11 AM. Perfect for those who need extra space or mobility aids.',
    likes: 32,
    comments: 8,
    type: 'tip',
    tags: ['tips', 'routes']
  },
  {
    id: 3,
    author: 'Anita K.',
    avatar: '👩‍🦯',
    badge: 'Visual Impairment Advocate',
    time: '1 day ago',
    content: 'Audio announcements on Metro Blue Line are now clearer! Makes independent travel so much easier for visually impaired commuters.',
    likes: 67,
    comments: 23,
    type: 'positive',
    tags: ['accessibility', 'visual']
  }
];

const accessibilityTips = [
  { id: 1, icon: '♿', title: 'Best Wheelchair Routes', description: 'Routes 1A, 3C, and Metro have full ramp access', saves: 234 },
  { id: 2, icon: '👁️', title: 'Audio-Enabled Stations', description: 'Central, Gandhipuram, RS Puram have clear announcements', saves: 189 },
  { id: 3, icon: '👴', title: 'Senior-Friendly Times', description: 'Travel between 10 AM - 4 PM for less crowding', saves: 156 },
  { id: 4, icon: '🦮', title: 'Service Animal Friendly', description: 'All metro stations and Route 1A buses welcome service animals', saves: 98 }
];

const helpRequests = [
  { id: 1, user: 'Kavitha R.', need: 'Need companion for Metro ride tomorrow 9 AM', type: 'companion', status: 'open', responses: 3 },
  { id: 2, user: 'Suresh P.', need: 'Looking for wheelchair-accessible route to Brookefields', type: 'route', status: 'resolved', responses: 5 }
];

const volunteerStats = {
  totalVolunteers: 156,
  helpProvided: 423,
  activeNow: 12
};

function CommunityHub() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPost, setNewPost] = useState('');

  return (
    <div className="community-page">
      {/* Header */}
      <div className="community-header">
        <h1>🤝 Community Hub</h1>
        <p>Connect, share, and help fellow travelers</p>
        
        <div className="community-stats">
          <div className="comm-stat">
            <span className="stat-num">2.4K</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="comm-stat">
            <span className="stat-num">{volunteerStats.activeNow}</span>
            <span className="stat-label">Online Now</span>
          </div>
          <div className="comm-stat">
            <span className="stat-num">{volunteerStats.helpProvided}</span>
            <span className="stat-label">Help Given</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="community-tabs">
        {['feed', 'tips', 'help', 'volunteer'].map(tab => (
          <button
            key={tab}
            className={`comm-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'feed' && '📱'}
            {tab === 'tips' && '💡'}
            {tab === 'help' && '🆘'}
            {tab === 'volunteer' && '🤝'}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="community-content">
        {activeTab === 'feed' && (
          <>
            {/* New Post Button */}
            <button 
              className="new-post-btn"
              onClick={() => setShowPostModal(true)}
            >
              ✏️ Share your experience or tip
            </button>

            {/* Posts Feed */}
            <div className="posts-feed">
              {communityPosts.map(post => (
                <div key={post.id} className={`post-card ${post.type}`}>
                  <div className="post-header">
                    <div className="post-author">
                      <span className="author-avatar">{post.avatar}</span>
                      <div className="author-info">
                        <span className="author-name">{post.author}</span>
                        <span className="author-badge">{post.badge}</span>
                      </div>
                    </div>
                    <span className="post-time">{post.time}</span>
                  </div>
                  
                  <p className="post-content">{post.content}</p>
                  
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                  
                  <div className="post-actions">
                    <button className="action-btn">
                      <span>❤️</span> {post.likes}
                    </button>
                    <button className="action-btn">
                      <span>💬</span> {post.comments}
                    </button>
                    <button className="action-btn">
                      <span>🔗</span> Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'tips' && (
          <div className="tips-section">
            <h3>♿ Accessibility Tips from Community</h3>
            <div className="tips-grid">
              {accessibilityTips.map(tip => (
                <div key={tip.id} className="tip-card">
                  <span className="tip-icon">{tip.icon}</span>
                  <div className="tip-content">
                    <h4>{tip.title}</h4>
                    <p>{tip.description}</p>
                  </div>
                  <div className="tip-meta">
                    <span className="saves">📌 {tip.saves} saved</span>
                    <button className="save-btn">Save</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="contribute-card">
              <span className="contribute-icon">💡</span>
              <div>
                <h4>Have a tip to share?</h4>
                <p>Help others by sharing your accessibility insights</p>
              </div>
              <button className="contribute-btn">Add Tip</button>
            </div>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="help-section">
            <div className="help-hero">
              <h3>🆘 Request or Offer Help</h3>
              <p>Our community is here to support accessible travel</p>
              <div className="help-buttons">
                <button className="help-btn request">🙋 Request Help</button>
                <button className="help-btn offer">🤝 Offer Help</button>
              </div>
            </div>

            <h4>Active Requests</h4>
            <div className="requests-list">
              {helpRequests.map(req => (
                <div key={req.id} className={`request-card ${req.status}`}>
                  <div className="request-header">
                    <span className="request-user">{req.user}</span>
                    <span className={`request-status ${req.status}`}>
                      {req.status === 'open' ? '🟢 Open' : '✅ Resolved'}
                    </span>
                  </div>
                  <p className="request-need">{req.need}</p>
                  <div className="request-footer">
                    <span className="request-type">{req.type}</span>
                    <span className="responses">{req.responses} responses</span>
                    {req.status === 'open' && (
                      <button className="respond-btn">Respond</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'volunteer' && (
          <div className="volunteer-section">
            <div className="volunteer-hero">
              <span className="vol-icon">🦸</span>
              <h3>Become a Transit Buddy</h3>
              <p>Help make travel accessible for everyone in your community</p>
              <button className="volunteer-btn">Join as Volunteer</button>
            </div>

            <div className="volunteer-stats-grid">
              <div className="vol-stat-card">
                <span className="vol-stat-icon">👥</span>
                <span className="vol-stat-value">{volunteerStats.totalVolunteers}</span>
                <span className="vol-stat-label">Active Volunteers</span>
              </div>
              <div className="vol-stat-card">
                <span className="vol-stat-icon">🤝</span>
                <span className="vol-stat-value">{volunteerStats.helpProvided}</span>
                <span className="vol-stat-label">Help Provided</span>
              </div>
              <div className="vol-stat-card highlight">
                <span className="vol-stat-icon">🟢</span>
                <span className="vol-stat-value">{volunteerStats.activeNow}</span>
                <span className="vol-stat-label">Available Now</span>
              </div>
            </div>

            <div className="volunteer-benefits">
              <h4>Volunteer Benefits</h4>
              <ul>
                <li>🏅 Earn Community Champion badges</li>
                <li>🎫 Get free transit passes as rewards</li>
                <li>📜 Receive volunteer certificates</li>
                <li>❤️ Make a real difference in someone's life</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="post-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share with Community</h3>
              <button className="close-btn" onClick={() => setShowPostModal(false)}>✕</button>
            </div>
            <textarea
              placeholder="Share your experience, tip, or question..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <div className="modal-footer">
              <div className="post-options">
                <button className="option-btn">📍 Location</button>
                <button className="option-btn">🏷️ Tags</button>
              </div>
              <button className="submit-post-btn">Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityHub;
