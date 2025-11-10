// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import CalculatorTab from './CalculatorTab';
import UsersTab from './UsersTab';
import ActivityTab from './ActivityTab';
import '../styles/Dashboard.css';
import '../styles/Header.css'; // uses the ds-tabs styles

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        {/* Tabs styled like the screenshot (pill active, subtle group background) */}
        <nav className="ds-tabsbar" aria-label="Primary navigation">
          <div className="ds-tabs">
            <button
              type="button"
              className={`ds-tab ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <span className="ds-tab-icon">🧮</span>
              <span className="ds-tab-label">Calculator</span>
            </button>

            <button
              type="button"
              className={`ds-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <span className="ds-tab-icon">👥</span>
              <span className="ds-tab-label">Users</span>
            </button>

            <button
              type="button"
              className={`ds-tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <span className="ds-tab-icon">📈</span>
              <span className="ds-tab-label">Activity</span>
            </button>
          </div>
        </nav>

        <div className="tab-panels">
          {activeTab === 'calculator' && <CalculatorTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'activity' && <ActivityTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;