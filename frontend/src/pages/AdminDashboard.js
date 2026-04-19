import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

/**
 * AdminDashboard Component - Admin management interface
 */
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: '📚', label: 'Total Books', value: '2,450', change: '+12%' },
    { icon: '👥', label: 'Users', value: '5,840', change: '+8%' },
    { icon: '⭐', label: 'Avg Rating', value: '4.8', change: '+2%' },
    { icon: '💰', label: 'Revenue', value: '$24.5K', change: '+15%' },
  ];

  const recentActivities = [
    { id: 1, action: 'New user signup', user: 'Sarah Johnson', time: '2 hours ago' },
    { id: 2, action: 'Book added', book: 'Atomic Habits', time: '4 hours ago' },
    { id: 3, action: 'Review posted', book: 'The Midnight Library', time: '6 hours ago' },
    { id: 4, action: 'User subscription', user: 'Mike Chen', time: '1 day ago' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-title">
          <h1>🛡️ Admin Dashboard</h1>
          <p>Manage and monitor your bookstore</p>
        </div>
        <div className="admin-user-info">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p>{user?.email}</p>
            <p>Administrator</p>
          </div>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="admin-tabs">
        {['overview', 'books', 'users', 'analytics'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <p className="stat-label">{stat.label}</p>
                    <div className="stat-details">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-change">{stat.change}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="activities-section">
              <h2>Recent Activities</h2>
              <div className="activities-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">📌</div>
                    <div className="activity-details">
                      <p className="activity-action">{activity.action}</p>
                      <p className="activity-meta">
                        {activity.user || activity.book} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="tab-content">
            <div className="empty-state">
              <p>📚 Manage your book collection here</p>
              <button className="add-btn">+ Add New Book</button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="tab-content">
            <div className="empty-state">
              <p>👥 View and manage users here</p>
              <button className="add-btn">📊 View All Users</button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="tab-content">
            <div className="empty-state">
              <p>📈 Detailed analytics and reports</p>
              <button className="add-btn">📉 View Reports</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
