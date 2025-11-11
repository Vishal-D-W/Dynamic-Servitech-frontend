import React, { useState, useContext } from 'react'; import axios from 'axios'; import { useNavigate } from 'react-router-dom'; import { AuthContext } from '../context/AuthContext'; import '../styles/Login.css';

const toMessage = (err) => { if (!err) return 'Something went wrong'; if (typeof err === 'string') return err; if (err.response?.data?.error) return String(err.response.data.error); if (err.message) return String(err.message); try { return JSON.stringify(err); } catch { return 'Something went wrong'; } };

const Login = () => { const { setAuth } = useContext(AuthContext); // adjust based on your context API const navigate = useNavigate();

const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [username, setUsername] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [isSignup, setIsSignup] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('');

const handleSignin = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { const { data } = await axios.post('/api/auth/login', { email, password }); const { token, user } = data || {}; if (!token || !user) throw new Error('Invalid response from server'); // Save token, update context, navigate — adjust to your app setAuth({ token, user }); navigate('/'); } catch (err) { setError(toMessage(err)); } finally { setLoading(false); } };

const handleSignup = async (e) => { e.preventDefault(); setError(''); setLoading(true); try { const { data } = await axios.post('/api/auth/signup', { username, email, password, confirmPassword, }); if (!data) throw new Error('Invalid response from server'); alert('Account created! Please wait for admin activation.'); setIsSignup(false); } catch (err) { setError(toMessage(err)); } finally { setLoading(false); } };

return ( <div className="login-container"> <form onSubmit={isSignup ? handleSignup : handleSignin}> {isSignup && ( <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required /> )} <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required /> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required /> {isSignup && ( <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required /> )} {error && <div className="error">{error}</div>} <button type="submit" disabled={loading}> {loading ? (isSignup ? 'Creating Account...' : 'Signing In...') : (isSignup ? 'Create Account' : 'Sign In')} </button> <p className="toggle-form"> Don't have an account?{' '} <button type="button" onClick={() => setIsSignup(!isSignup)}> {isSignup ? 'Back to Sign In' : 'Create Account'} </button> </p> </form> </div> ); };

export default Login;
