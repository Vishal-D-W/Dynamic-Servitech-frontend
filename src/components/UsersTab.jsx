// src/components/UsersTab.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UsersTab.css';

const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'service_engineer',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError('');
    try {
      const { data } = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.users || []);
    } catch {
      setError('Failed to fetch users');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ username: '', email: '', password: '', role: 'service_engineer' });
      setShowCreateForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    setError('');
    try {
      await axios.patch(`/api/users/${userId}/activate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      setError('Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    setError('');
    try {
      await axios.patch(`/api/users/${userId}/deactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      setError('Failed to deactivate user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    setError('');
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      setError('Failed to delete user');
    }
  };

  return (
    <div className="tab-content">
      <section className="users-section">
        <div className="users-bar">
          <div>
            <h3 className="users-title">All Users</h3>
            <p className="users-sub">Manage system users</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateForm((v) => !v)}
          >
            + Create User
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateUser} className="card create-user-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="service_engineer">Service Engineer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && <div className="alert error">❌ {error}</div>}

        <div className="table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="cell-user">
                    <span className="user-avatar">{u.username?.[0]?.toUpperCase() || 'U'}</span>
                    <span className="user-name">{u.username}</span>
                  </td>
                  <td className="cell-email">{u.email}</td>
                  <td><span className="badge badge-role">{u.role}</span></td>
                  <td>
                    <span className={`badge badge-status ${u.status}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="actions">
                    {u.status === 'inactive' ? (
                      <button
                        onClick={() => handleActivateUser(u._id)}
                        className="btn btn-success"
                      >
                        ✅ Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDeactivateUser(u._id)}
                        className="btn btn-warning"
                      >
                        ⏸ Deactivate
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="btn btn-danger"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty">No users yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="cards-grid">
          {users.map((u) => (
            <div className="user-card card" key={u._id}>
              <div className="uc-head">
                <span className="user-avatar lg">{u.username?.[0]?.toUpperCase() || 'U'}</span>
                <div className="uc-titles">
                  <div className="uc-name">{u.username}</div>
                  <div className="uc-email">{u.email}</div>
                </div>
                <span className="badge badge-role">{u.role}</span>
              </div>
              <div className="uc-row">
                <span className="label">Status</span>
                <span className={`badge badge-status ${u.status}`}>{u.status}</span>
              </div>
              <div className="uc-actions">
                {u.status === 'inactive' ? (
                  <button
                    onClick={() => handleActivateUser(u._id)}
                    className="btn btn-success"
                  >
                    ✅ Activate
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeactivateUser(u._id)}
                    className="btn btn-warning"
                  >
                    ⏸ Deactivate
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  className="btn btn-danger"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && <div className="card empty">No users yet</div>}
        </div>
      </section>
    </div>
  );
};

export default UsersTab;