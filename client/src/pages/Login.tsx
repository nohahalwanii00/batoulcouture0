import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [emailReadOnly, setEmailReadOnly] = useState(true);
  const [passwordReadOnly, setPasswordReadOnly] = useState(true);

  // When arriving from logout, force-clear any autofilled values
  useEffect(() => {
    const state = location.state as any;
    if (state?.fromLogout) {
      setEmail('');
      setPassword('');
      if (emailRef.current) emailRef.current.value = '';
      if (passwordRef.current) passwordRef.current.value = '';
      setEmailReadOnly(true);
      setPasswordReadOnly(true);
      // Remove state flag to avoid re-trigger on back/forward
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const normalizedPassword = (password || '').trim();
      const res = await authAPI.login({ email: normalizedEmail, password: normalizedPassword });
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        navigate('/dashboard');
      } else {
        setError('Invalid server response.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              name="login-email"
              ref={emailRef}
              readOnly={emailReadOnly}
              onFocus={() => setEmailReadOnly(false)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              name="login-password"
              ref={passwordRef}
              readOnly={passwordReadOnly}
              onFocus={() => setPasswordReadOnly(false)}
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
