// src/components/ActivityTab.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ActivityTab.css';

const ActivityTab = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchActivityLogs = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('/api/activity', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(data.activities || []);
      } catch {
        setError('Failed to fetch activity logs');
      } finally {
        setLoading(false);
      }
    };
    fetchActivityLogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const badgeClass = (action) => {
    switch (action) {
      case 'login': return 'badge action-login';
      case 'logout': return 'badge action-logout';
      case 'user_created': return 'badge action-created';
      case 'user_deleted': return 'badge action-deleted';
      case 'user_activated': return 'badge action-activated';
      case 'user_deactivated': return 'badge action-deactivated';
      default: return 'badge';
    }
  };

  return (
    <div className="tab-content">
      <section className="activity-section">
        <div className="activity-header">
          <h3 className="title">Activity Logs</h3>
          <p className="subtitle">View all user login and logout activities</p>
        </div>

        {error && <div className="alert error">❌ {error}</div>}
        {loading && <div className="alert">Loading activities…</div>}

        <div className="table-card">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activities.length ? (
                activities.map((a, i) => (
                  <tr key={i}>
                    <td>{a.username}</td>
                    <td className="cell-email">{a.email}</td>
                    <td><span className={badgeClass(a.action)}>{a.action.replace('_', ' ')}</span></td>
                    <td className="cell-time">{formatDate(a.timestamp)}</td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan={4} className="empty">No activities recorded yet</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="cards-grid">
          {activities.map((a, i) => (
            <div className="card activity-card" key={i}>
              <div className="row">
                <span className="label">Username</span>
                <span className="value">{a.username}</span>
              </div>
              <div className="row">
                <span className="label">Email</span>
                <span className="value ellipsis">{a.email}</span>
              </div>
              <div className="row">
                <span className="label">Action</span>
                <span className={badgeClass(a.action)}>{a.action.replace('_', ' ')}</span>
              </div>
              <div className="row">
                <span className="label">Timestamp</span>
                <span className="value">{formatDate(a.timestamp)}</span>
              </div>
            </div>
          ))}
          {!activities.length && !loading && <div className="card empty">No activities recorded yet</div>}
        </div>
      </section>
    </div>
  );
};

export default ActivityTab;