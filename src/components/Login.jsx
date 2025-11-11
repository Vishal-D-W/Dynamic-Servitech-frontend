import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Login.css';

const toMessage = (err) => {
  if (!err) return 'Something went wrong';
  if (typeof err === 'string') return err;
  // axios error shapes
  if (err.response?.data?.error) return String(err.response.data.error);
  if (err.response?.data?.message) return String(err.response.data.message);
  if (err.message) return String(err.message);
  try {
    return JSON.stringify(err);
  } catch {
    return 'Something went wrong';
  }
};

const Login = () => {
  const authContext = useContext(AuthContext);
  // attempt to read setAuth safely
  const setAuth = authContext?.setAuth || (() => {});
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      // Accept multiple possible shapes; try common keys
      const token = data?.token || data?.accessToken || data?.data?.token;
      const user = data?.user || data?.userData || data?.data?.user;
      if (!token) throw new Error('No token returned from server');
      // Persist token
      localStorage.setItem('token', token);
      // Update context if available
      try { setAuth({ token, user }); } catch {}
      // navigate to protected route (adjust as needed)
      navigate('/');
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/signup', {
        username,
        email,
        password,
        confirmPassword,
      });
      if (!data) throw new Error('Invalid response from server');
      // If signup returns a token & user and you want to auto-login, you can handle it here.
      alert('Account created! Please wait for admin activation.');
      setIsSignup(false);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={isSignup ? handleSignup : handleSignin} className="login-form">
        <h2>{isSignup ? 'Create Account' : 'Sign In'}</h2>

        {isSignup && (
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>

        {isSignup && (
          <label>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </label>
        )}

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')}
        </button>

        <p className="toggle-form">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setError('');
              setIsSignup(!isSignup);
            }}
            className="link-button"
          >
            {isSignup ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
