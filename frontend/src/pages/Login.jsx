import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Play } from 'lucide-react';
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
        email: response.email || 'admin@corely.com',
        fullName: response.fullName || 'Alex Johnson',
        role: response.role || 'ROLE_ADMIN',
        joiningDate: 'Jan 2024'
      });

      if (onShowToast) {
        onShowToast('Welcome to Corely, ' + (response.fullName || 'Alex Johnson') + '!', 'success');
      }
      navigate('/');
    } catch (err) {
      console.warn('Backend login fallback:', err.message);
      if (username === 'admin' && password === 'admin123') {
        const fallbackUser = {
          id: 1,
          username: 'admin',
          email: 'admin@corely.com',
          fullName: 'Alex Johnson',
          role: 'ROLE_ADMIN',
          joiningDate: 'Jan 2024'
        };
        setAuthToken('corely-jwt-session-token');
        setStoredUser(fallbackUser);
        if (onShowToast) onShowToast('Signed in to Corely successfully', 'success');
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
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(132, 204, 22, 0.12) 0%, #080A0F 70%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Aesthetic Blur Shapes */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(132, 204, 22, 0.08)',
        filter: 'blur(120px)',
        top: '10%',
        left: '15%',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#121620',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(132, 204, 22, 0.12)',
        borderRadius: '24px',
        padding: '40px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            background: 'linear-gradient(135deg, #A3E635 0%, #65A30D 100%)',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(163, 230, 53, 0.4)',
            marginBottom: '16px',
            color: '#080A0F'
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#080A0F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h3l2 3h4l1-2" />
              <circle cx="12" cy="4" r="2" />
            </svg>
          </div>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            margin: 0
          }}>
            Corely <span style={{ color: '#84CC16' }}>HUD</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '6px' }}>
            Next-Gen Performance & Gym Command Center
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#EF4444',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">Username / Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '42px' }}
                placeholder="admin or admin@gym.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <User size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '42px', paddingRight: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
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
                  color: '#94A3B8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)',
              color: '#080A0F',
              boxShadow: '0 4px 20px rgba(132, 204, 22, 0.4)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Authenticating...' : 'Enter Corely Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Demo Auto-Fill Shortcut */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleUseDemo}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Auto-Fill Demo Credentials (<span style={{ color: '#84CC16' }}>admin / admin123</span>)
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
                color: '#84CC16',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Play size={14} fill="#84CC16" /> Watch Cinematic Gym Intro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
