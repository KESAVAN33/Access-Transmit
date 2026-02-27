/**
 * AccessTransit - Main Application Component
 * 
 * This component handles routing and global state management
 * for the AccessTransit application.
 */

import React, { useState, useEffect, createContext } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import RouteDetails from './components/RouteDetails';
import TrackingScreen from './components/TrackingScreen';
import TrainRouteDetails from './components/TrainRouteDetails';
import TrainTrackingScreen from './components/TrainTrackingScreen';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ProfileSection from './components/ProfileSection';
import VoiceAssistant from './components/VoiceAssistant';
// New Problem-Solving Features
import EmergencySOS from './components/EmergencySOS';
import CaregiverMode from './components/CaregiverMode';
import AccessibilityReports from './components/AccessibilityReports';
import SmartRoutePlanner from './components/SmartRoutePlanner';
import ImpactDashboard from './components/ImpactDashboard';
// Winning Features
import Gamification from './components/Gamification';
import AIJourneyPredictor from './components/AIJourneyPredictor';
import CommunityHub from './components/CommunityHub';
import CarbonTracker from './components/CarbonTracker';
import BuddyConnect from './components/BuddyConnect';
import { simulateBusMovement, simulateTrainMovement } from './data/busData';

// Create context for accessibility mode (shared across components)
export const AccessibilityContext = createContext();

function App() {
  // Global accessibility mode toggle
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [kyc, setKyc] = useState(() => {
    // Persist KYC in sessionStorage for demo
    try {
      return JSON.parse(window.sessionStorage.getItem('accesstransit_kyc')) || null;
    } catch {
      return null;
    }
  });
  const location = useLocation();

  // Simulate real-time bus and train movement updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      simulateBusMovement();
      simulateTrainMovement();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Toggle accessibility mode
  const toggleAccessibility = () => {
    setAccessibilityMode(prev => !prev);
  };

  // Handle KYC verification
  const handleKycVerified = (kycData) => {
    setKyc(kycData);
    window.sessionStorage.setItem('accesstransit_kyc', JSON.stringify(kycData));
  };

  if (!kyc) {
    return <LandingPage onVerified={handleKycVerified} />;
  }

  return (
    <AccessibilityContext.Provider value={{ accessibilityMode, toggleAccessibility }}>
      <div className="app-container">
        {/* Navigation Header */}
        <header className="app-header">
          <div className="header-content">
            <Link to="/" className="logo">
              <span className="logo-icon">🚌</span>
              <span className="logo-text">AccessTransit</span>
            </Link>
            
            <nav className="main-nav">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/reports" 
                className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}
              >
                Reports
              </Link>
              <Link 
                to="/impact" 
                className={`nav-link ${location.pathname === '/impact' ? 'active' : ''}`}
              >
                Impact
              </Link>
              <div className="nav-dropdown">
                <button className="nav-link dropdown-trigger">More ▾</button>
                <div className="dropdown-menu">
                  <Link to="/rewards" className="dropdown-item">🏆 Rewards</Link>
                  <Link to="/ai-predict" className="dropdown-item">🧠 AI Predictor</Link>
                  <Link to="/community" className="dropdown-item">🤝 Community</Link>
                  <Link to="/carbon" className="dropdown-item">🌱 Carbon</Link>
                  <Link to="/buddy" className="dropdown-item">👥 Buddy Connect</Link>
                </div>
              </div>
            </nav>

            {/* Accessibility Toggle in Header */}
            <div className="accessibility-toggle-header">
              <button 
                className={`accessibility-btn ${accessibilityMode ? 'active' : ''}`}
                onClick={toggleAccessibility}
                aria-label="Toggle accessibility mode"
                title="Toggle accessibility mode"
              >
                <span className="accessibility-icon">♿</span>
                <span className="accessibility-label">
                  {accessibilityMode ? 'ON' : 'OFF'}
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Accessibility Mode Banner */}
        {accessibilityMode && (
          <div className="accessibility-banner" role="alert">
            <span>♿ Accessibility Mode Active - Showing wheelchair accessible vehicles only</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/route/:routeId" element={<RouteDetails />} />
            <Route path="/track/:busId" element={<TrackingScreen />} />
            <Route path="/train-route/:routeId" element={<TrainRouteDetails />} />
            <Route path="/track-train/:trainId" element={<TrainTrackingScreen />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileSection />} />
            {/* New Problem-Solving Routes */}
            <Route path="/sos" element={<EmergencySOS />} />
            <Route path="/caregiver" element={<CaregiverMode />} />
            <Route path="/reports" element={<AccessibilityReports />} />
            <Route path="/planner" element={<SmartRoutePlanner />} />
            <Route path="/impact" element={<ImpactDashboard />} />
            {/* Winning Features */}
            <Route path="/rewards" element={<Gamification />} />
            <Route path="/ai-predict" element={<AIJourneyPredictor />} />
            <Route path="/community" element={<CommunityHub />} />
            <Route path="/carbon" element={<CarbonTracker />} />
            <Route path="/buddy" element={<BuddyConnect />} />
          </Routes>
        </main>

        {/* Quick Action Floating Buttons */}
        <div className="quick-actions-fab">
          <Link to="/sos" className="fab-btn sos-fab" title="Emergency SOS">
            🆘
          </Link>
          <Link to="/caregiver" className="fab-btn caregiver-fab" title="Caregiver Mode">
            👨‍👩‍👧
          </Link>
          <Link to="/profile" className="fab-btn profile-fab" title="Profile">
            👤
          </Link>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>AccessTransit © 2026 - Human-Centered Public Transport</p>
        </footer>

        {/* Voice Assistant */}
        <VoiceAssistant kyc={kyc} onToggleAccessibility={toggleAccessibility} />
      </div>
    </AccessibilityContext.Provider>
  );
}

export default App;
