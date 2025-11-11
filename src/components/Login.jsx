import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

const toMessage = (err) => {
  if (!err) return 'Something went wrong';
  if (typeof err === 'string') return err;
  if (err.response?.data?.error) return String(err.response.data.error);
  if (err.message) return String(err.message);
  try { return JSON.stringify(err); } catch { return 'Something went wrong'; }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      const { token, user } = data || {};
      if (!token || !user) throw new Error('Invalid response from server');

      login(user, token);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', {
        username,
        email,
        password,
        confirmPassword,
      });
      if (!data) throw new Error('Invalid response from server');

      alert('Account created! Please wait for admin activation.');
      setIsSignup(false);
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dynamic Servitech</h1>
          <p>ACD Password Calculator & Management System</p>
        </div>

        {isSignup ? (
          <form onSubmit={handleSignup} className="login-form">
            <h2>Create Account</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <p className="toggle-form">
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignup(false)}>
                Sign In
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <h2>Welcome Back</h2>
            <p>Sign in to access your dashboard</p>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <p className="toggle-form">
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setIsSignup(true)}>
                Create Account
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
