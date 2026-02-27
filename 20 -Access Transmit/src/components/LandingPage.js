/**
 * AccessTransit - Landing Page
 *
 * Simple animated landing with quick signup.
 */
import React, { useState, useEffect } from 'react';

const cities = [
  'Coimbatore',
  'Chennai',
  'Bangalore',
  'Hyderabad',
  'Mumbai',
  'Delhi',
  'Kolkata'
];

const disabilityTypes = [
  { id: 'none', label: 'No Accessibility Needs' },
  { id: 'wheelchair', label: 'Wheelchair User ♿' },
  { id: 'visual', label: 'Visual Impairment 👁️' },
  { id: 'hearing', label: 'Hearing Impairment 👂' },
  { id: 'cognitive', label: 'Cognitive Support 🧠' },
  { id: 'elderly', label: 'Elderly/Mobility 👴' }
];

function LandingPage({ onVerified }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Coimbatore');
  const [disabilityType, setDisabilityType] = useState('none');
  const [isCaregiver, setIsCaregiver] = useState(false);
  const [error, setError] = useState('');

  // Auto-show form after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }
    setError('');
    onVerified({ name, phone, city, disabilityType, isCaregiver });
  };

  return (
    <div className="landing-page-simple">
      {/* Animated Logo Section */}
      <div className={`logo-animation-container ${showForm ? 'compact' : ''}`}>
        <div className="animated-logo">
          <span className="logo-bus">🚌</span>
          <h1 className="animated-title">
            <span className="title-access">Access</span>
            <span className="title-transit">Transit</span>
          </h1>
        </div>
        <p className={`tagline ${showForm ? 'visible' : ''}`}>
          Making Public Transit Accessible for Everyone
        </p>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="signup-form-container">
          <div className="signup-card">
            <h2>Get Started</h2>
            <p className="signup-desc">Quick setup to personalize your experience</p>
            
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    autoFocus
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="For SOS alerts"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <select
                    id="city"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="disability">Accessibility</label>
                  <select
                    id="disability"
                    value={disabilityType}
                    onChange={e => setDisabilityType(e.target.value)}
                  >
                    {disabilityTypes.map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={isCaregiver}
                  onChange={e => setIsCaregiver(e.target.checked)}
                />
                <span>I'm a caregiver tracking a dependent</span>
              </label>
              
              {error && <div className="form-error">{error}</div>}
              
              <button className="submit-btn" type="submit">
                Continue
              </button>
              
              <p className="privacy-note">
                🔒 Data stored locally only
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
