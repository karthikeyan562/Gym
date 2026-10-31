import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Play, Dumbbell, Sparkles } from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../api/apiClient';

export default function Login({ onShowToast, onOpenIntro }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login({ username, password });
      setAuthToken(response.token || 'corely-jwt-session-token');
      setStoredUser({
        id: response.id || 1,
        username: response.username || 'admin',
        email: response.email || 'admin@workoutmasters.com',
        fullName: response.fullName || 'Alex Johnson',
        role: response.role || 'ROLE_ADMIN',
        joiningDate: 'Jan 2024'
      });

      if (onShowToast) {
        onShowToast('Welcome to Workout Masters, ' + (response.fullName || 'Alex Johnson') + '!', 'success');
      }
      navigate('/');
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      if (username === 'admin' && password === 'admin123') {
        const fallbackUser = {
          id: 1,
          username: 'admin',
          email: 'admin@workoutmasters.com',
          fullName: 'Alex Johnson',
          role: 'ROLE_ADMIN',
          joiningDate: 'Jan 2024'
        };
        setAuthToken('corely-jwt-session-token');
        setStoredUser(fallbackUser);
        if (onShowToast) onShowToast('Signed in to Workout Masters successfully', 'success');
        navigate('/');
      } else {
        setError(err.message || 'Invalid username or password. Default is admin / admin123');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="login-container">
      {/* Multiverse Ambient Decorative Glows */}
      <div
        className="multiverse-mesh-bg"
        style={{
          width: '540px',
          height: '540px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, transparent 70%)',
          top: '-8%',
          left: '12%'
        }}
      />
      <div
        className="multiverse-mesh-bg"
        style={{
          width: '480px',
          height: '480px',
          background: 'radial-gradient(circle, rgba(255, 138, 50, 0.2) 0%, transparent 70%)',
          bottom: '-10%',
          right: '10%'
        }}
      />
      <div
        className="multiverse-mesh-bg"
        style={{
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(165, 255, 56, 0.14) 0%, transparent 70%)',
          top: '40%',
          right: '35%'
        }}
      />

      {/* Subtle Multiverse Geometric Grid Accents */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none'
        }}
      />

      {/* Centered Premium Glassmorphic Card */}
      <div className="login-card" style={{ maxWidth: '420px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="login-brand-logo">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h3l2 3h4l1-2" />
              <circle cx="12" cy="4" r="2" />
            </svg>
          </div>

          {/* Logo with Orange / TVA Green Gradient Text Split */}
          <h1 className="login-brand-title">
            <span style={{
              background: 'linear-gradient(135deg, #FF8A32 0%, #FFA055 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900
            }}>
              WORKOUT
            </span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #A5FF38 0%, #7ACC28 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900
            }}>
              MASTERS
            </span>
          </h1>

          <p className="login-brand-subtitle">
            Premium Performance Management
          </p>

          <div style={{ marginTop: '10px' }}>
            <span className="multiverse-pill">
              <Sparkles size={12} />
              LOKI MULTIVERSE SYNC
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-error-alert">
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Username / Operator Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="admin or admin@gym.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User
                size={18}
                color="#5C6070"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Security Key / Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock
                size={18}
                color="#5C6070"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#A5A8B0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Enter Workout Masters'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Demo Auto-Fill Shortcut */}
        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleUseDemo}
            className="login-demo-pill"
          >
            Auto-Fill Demo Credentials (<span style={{ color: 'var(--accent-orange)' }}>admin / admin123</span>)
          </button>
        </div>

        {/* Watch Intro Video Button */}
        {onOpenIntro && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={onOpenIntro}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-tva-green)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Play size={14} fill="#A5FF38" color="#A5FF38" />
              Watch Cinematic Gym Intro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
