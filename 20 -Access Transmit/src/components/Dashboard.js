/**
 * AccessTransit - Enhanced Dashboard Component
 * 
 * Comprehensive dashboard with:
 * - Real-time fleet monitoring
 * - User analytics
 * - Accessibility insights
 * - System health status
 * - Quick actions
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import {
  getDashboardStats,
  getRecentAlerts,
  getAllBuses,
  assessRisk,
  getCrowdIndicator,
  calculateSafetyScore,
  detectFallRisk
} from '../data/busData';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [buses, setBuses] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  // User stats (simulated)
  const userStats = {
    totalUsers: 15420,
    activeToday: 2847,
    accessibleUsers: 1256,
    caregiverUsers: 423,
    tripsToday: 8934,
    avgTripDuration: '24 min',
    sosAlertsToday: 3,
    issuesReported: 12
  };

  // System health
  const systemHealth = {
    apiStatus: 'operational',
    gpsAccuracy: '98.5%',
    dataLatency: '1.2s',
    uptime: '99.97%'
  };

  // Load and refresh dashboard data
  useEffect(() => {
    const updateDashboard = () => {
      setStats(getDashboardStats());
      setAlerts(getRecentAlerts());
      setBuses(getAllBuses());
      setCurrentTime(new Date());
    };

    updateDashboard();
    const interval = setInterval(updateDashboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const COLORS = {
    low: '#059669',
    medium: '#d97706',
    high: '#dc2626',
    primary: '#2563eb',
    secondary: '#7c3aed'
  };

  const crowdPieData = [
    { name: 'Low', value: stats.crowdDistribution.Low, color: COLORS.low },
    { name: 'Medium', value: stats.crowdDistribution.Medium, color: COLORS.medium },
    { name: 'High', value: stats.crowdDistribution.High, color: COLORS.high }
  ];

  return (
    <div className="dashboard-screen">
      {/* Dashboard Header */}
      <section className="dashboard-header">
        <div className="header-left">
          <h1>Dashboard</h1>
          <p className="header-subtitle">Real-time monitoring & analytics</p>
        </div>
        <div className="header-right">
          <div className="system-status">
            <span className="status-dot operational"></span>
            <span className="status-text">All systems operational</span>
          </div>
          <span className="last-update">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </section>

      {/* Quick Stats Row */}
      <section className="quick-stats-row">
        <div className="quick-stat-card">
          <div className="stat-icon-wrapper blue">
            <span>🚌</span>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.activeBuses}/{stats.totalBuses}</span>
            <span className="stat-title">Active Fleet</span>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="stat-icon-wrapper green">
            <span>👥</span>
          </div>
          <div className="stat-info">
            <span className="stat-number">{userStats.activeToday.toLocaleString()}</span>
            <span className="stat-title">Active Users</span>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="stat-icon-wrapper purple">
            <span>🎯</span>
          </div>
          <div className="stat-info">
            <span className="stat-number">{userStats.tripsToday.toLocaleString()}</span>
            <span className="stat-title">Trips Today</span>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="stat-icon-wrapper orange">
            <span>♿</span>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.accessibleBuses}</span>
            <span className="stat-title">Accessible Buses</span>
          </div>
        </div>
        <div className="quick-stat-card warning">
          <div className="stat-icon-wrapper red">
            <span>⚠️</span>
          </div>
          <div className="stat-info">
            <span className="stat-number">{stats.riskAlerts}</span>
            <span className="stat-title">Active Alerts</span>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          Fleet Status
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
        </button>
      </div>
      {activeTab === 'overview' && (
        <div className="dashboard-content">
          {/* Charts Row */}
          <div className="charts-row">
            {/* Utilization by Route */}
            <div className="chart-card">
              <h3>Bus Utilization by Route</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.utilizationByRoute}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Utilization']}
                  />
                  <Bar dataKey="utilization" fill={COLORS.primary}>
                    {stats.utilizationByRoute.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Crowd Distribution Pie Chart */}
            <div className="chart-card">
              <h3>Current Crowd Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={crowdPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {crowdPieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Trends */}
          <div className="chart-card full-width">
            <h3>Crowd Trends Throughout the Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.hourlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis unit="%" domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${Math.round(value)}%`, 'Average Crowd']} />
                <Area 
                  type="monotone" 
                  dataKey="crowd" 
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="chart-note">
              * Peak hours (8-9 AM, 5-6 PM) typically show higher crowd levels
            </p>
          </div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div className="fleet-content">
          <h2>Fleet Status</h2>
          <div className="fleet-table-container">
            <table className="fleet-table">
              <thead>
                <tr>
                  <th>Bus ID</th>
                  <th>Route</th>
                  <th>Current Stop</th>
                  <th>Next Stop</th>
                  <th>Speed</th>
                  <th>Crowd</th>
                  <th>Risk</th>
                  <th>Safety Score</th>
                  <th>Fall Risk</th>
                  <th>Accessible</th>
                </tr>
              </thead>
              <tbody>
                {buses.map(bus => {
                  const crowdIndicator = getCrowdIndicator(bus.crowdLevel);
                  const risk = assessRisk(bus.crowdLevel, bus.turnAngle);
                  const safetyScore = calculateSafetyScore(bus);
                  const fallRisk = detectFallRisk(bus);
                  
                  return (
                    <tr key={bus.busId} className={risk.level === 'High' ? 'high-risk-row' : ''}>
                      <td className="bus-id">{bus.busId}</td>
                      <td>{bus.routeName}</td>
                      <td>{bus.currentStop}</td>
                      <td>{bus.nextStop}</td>
                      <td>{bus.avgSpeed} km/h</td>
                      <td>
                        <span className="crowd-badge" style={{ backgroundColor: crowdIndicator.color }}>
                          {crowdIndicator.emoji} {bus.crowdLevel}
                        </span>
                      </td>
                      <td>
                        <span className={`risk-badge ${risk.level.toLowerCase()}`}>
                          {risk.icon} {risk.level}
                        </span>
                      </td>
                      <td>
                        <span className="safety-score-cell" style={{ color: safetyScore >= 70 ? '#22c55e' : safetyScore >= 40 ? '#eab308' : '#ef4444' }}>
                          {safetyScore}%
                        </span>
                      </td>
                      <td>
                        {fallRisk.alert ? <span className="fall-risk-cell">⚠️ Yes</span> : <span>—</span>}
                      </td>
                      <td className="accessible-cell">
                        {bus.accessible ? '♿ Yes' : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-content">
          <div className="users-grid">
            <div className="user-stat-card">
              <div className="user-stat-header">
                <span className="user-stat-icon">👥</span>
                <span className="user-stat-title">Total Registered</span>
              </div>
              <span className="user-stat-value">{userStats.totalUsers.toLocaleString()}</span>
              <span className="user-stat-change positive">+12% this month</span>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-header">
                <span className="user-stat-icon">🟢</span>
                <span className="user-stat-title">Active Today</span>
              </div>
              <span className="user-stat-value">{userStats.activeToday.toLocaleString()}</span>
              <span className="user-stat-change positive">+5% vs yesterday</span>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-header">
                <span className="user-stat-icon">♿</span>
                <span className="user-stat-title">Accessibility Users</span>
              </div>
              <span className="user-stat-value">{userStats.accessibleUsers.toLocaleString()}</span>
              <span className="user-stat-change">8.1% of total</span>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-header">
                <span className="user-stat-icon">👨‍👩‍👧</span>
                <span className="user-stat-title">Caregivers</span>
              </div>
              <span className="user-stat-value">{userStats.caregiverUsers.toLocaleString()}</span>
              <span className="user-stat-change">Tracking dependents</span>
            </div>
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>User Activity (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={[
                  { day: 'Mon', users: 2100 },
                  { day: 'Tue', users: 2450 },
                  { day: 'Wed', users: 2280 },
                  { day: 'Thu', users: 2680 },
                  { day: 'Fri', users: 2890 },
                  { day: 'Sat', users: 1950 },
                  { day: 'Sun', users: 1720 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke={COLORS.primary} strokeWidth={2} dot={{ fill: COLORS.primary }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>User Types</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Regular', value: 12741, color: COLORS.primary },
                      { name: 'Wheelchair', value: 856, color: '#059669' },
                      { name: 'Visual', value: 234, color: '#7c3aed' },
                      { name: 'Elderly', value: 589, color: '#d97706' },
                      { name: 'Caregiver', value: 423, color: '#ec4899' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { color: COLORS.primary },
                      { color: '#059669' },
                      { color: '#7c3aed' },
                      { color: '#d97706' },
                      { color: '#ec4899' }
                    ].map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="quick-actions-section">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="action-icon">📢</span>
                <span>Send Alert</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📊</span>
                <span>Export Report</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">📧</span>
                <span>Notifications</span>
              </button>
              <button className="action-btn">
                <span className="action-icon">⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="alerts-content">
          <h2>Active Alerts</h2>
          {alerts.length === 0 ? (
            <div className="no-alerts">
              <span className="no-alerts-icon">✅</span>
              <p>No active safety alerts. All buses operating normally.</p>
            </div>
          ) : (
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className={`alert-card ${alert.type}`}>
                  <div className="alert-icon">
                    {alert.type === 'danger' ? '⚠️' : '⚡'}
                  </div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <span className="alert-bus">{alert.busId}</span>
                      <span className="alert-route">{alert.route}</span>
                      <span className="alert-time">{alert.timestamp}</span>
                    </div>
                    <p className="alert-message">{alert.message}</p>
                  </div>
                  <div className="alert-actions">
                    <button className="btn-acknowledge">Acknowledge</button>
                    <button className="btn-dispatch">Dispatch Help</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Alert Statistics */}
          <div className="alert-stats">
            <h3>Alert Statistics (Today)</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value text-red">
                  {alerts.filter(a => a.type === 'danger').length}
                </span>
                <span className="stat-label">High Risk</span>
              </div>
              <div className="stat-item">
                <span className="stat-value text-yellow">
                  {alerts.filter(a => a.type === 'warning').length}
                </span>
                <span className="stat-label">Warnings</span>
              </div>
              <div className="stat-item">
                <span className="stat-value text-green">
                  {buses.length - alerts.length}
                </span>
                <span className="stat-label">Safe</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <section className="dashboard-footer">
        <div className="footer-info">
          <p>Data refreshes every 5 seconds. Click refresh for immediate update.</p>
          <p>All times shown in local timezone.</p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
