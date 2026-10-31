import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Dumbbell,
  Users,
  Target,
  Trophy,
  CreditCard,
  Receipt,
  Wrench,
  BarChart3,
  LogOut,
  Sparkles,
  ChevronRight,
  PlaySquare,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { removeAuthToken, getStoredUser } from '../api/apiClient';

export default function Sidebar({ mobileOpen, setMobileOpen, onOpenIntro }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser() || { fullName: 'Alex Johnson', username: 'alex' };
  const [suiteOpen, setSuiteOpen] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  // Primary 5 icons matching the screenshot dock
  const dockIcons = [
    {
      name: 'Dashboard HUD',
      path: '/',
      icon: LayoutGrid,
      matcher: (p) => p === '/'
    },
    {
      name: 'Workouts & Sessions',
      path: '/sessions',
      icon: Dumbbell,
      matcher: (p) => p === '/sessions'
    },
    {
      name: 'Members & Coaches',
      path: '/members',
      icon: Users,
      matcher: (p) => p === '/members' || p === '/trainers'
    },
    {
      name: 'Hydration & Reports',
      path: '/reports',
      icon: Target,
      matcher: (p) => p === '/reports'
    },
    {
      name: 'Equipment & Assets',
      path: '/equipment',
      icon: Trophy,
      matcher: (p) => p === '/equipment' || p === '/maintenance'
    }
  ];

  // Extended suite for enterprise gym management
  const suiteItems = [
    { name: 'Gym Members', path: '/members', icon: Users },
    { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
    { name: 'Payments & Receipts', path: '/payments', icon: Receipt },
    { name: 'Personal Trainers', path: '/trainers', icon: Users },
    { name: 'Training Sessions', path: '/sessions', icon: Dumbbell },
    { name: 'Gym Equipment', path: '/equipment', icon: Trophy },
    { name: 'Maintenance Logs', path: '/maintenance', icon: Wrench },
    { name: 'Audited Analytics', path: '/reports', icon: BarChart3 }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 999 }} 
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Floating Left Dock matching the screenshot */}
      <aside className={`dock-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Workout Masters Runner Logo */}
        <NavLink 
          to="/" 
          className="corely-dock-brand" 
          title="WORKOUT MASTERS - Gym Management & Workout HUD"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h3l2 3h4l1-2" />
            <circle cx="12" cy="4" r="2" />
          </svg>
        </NavLink>

        {mobileOpen && (
          <button 
            className="dock-btn"
            style={{ marginBottom: '8px' }}
            onClick={() => setMobileOpen(false)}
            title="Close Menu"
          >
            <X size={20} />
          </button>
        )}

        {/* 5 Primary Dock Navigation Buttons */}
        <nav className="dock-nav-items">
          {dockIcons.map((item) => {
            const Icon = item.icon;
            const isActive = item.matcher(location.pathname);
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`corely-dock-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                title={item.name}
                aria-label={item.name}
              >
                <Icon size={20} />
                <span className="dock-tooltip">{item.name}</span>
              </NavLink>
            );
          })}

          {/* Quick Management Suite Drawer Toggle */}
          <button
            type="button"
            className={`corely-dock-btn ${suiteOpen ? 'is-active' : ''}`}
            onClick={() => setSuiteOpen(!suiteOpen)}
            title="More Options / Management Suite"
            style={{ marginTop: '14px' }}
          >
            <SlidersHorizontal size={19} />
            <span className="dock-tooltip">Management Suite</span>
          </button>

          {/* Replay Cinematic Intro */}
          {onOpenIntro && (
            <button
              type="button"
              className="corely-dock-btn"
              onClick={onOpenIntro}
              title="Watch Cinematic Intro"
            >
              <PlaySquare size={19} color="#FF8A32" />
              <span className="dock-tooltip">Replay Video Intro</span>
            </button>
          )}
        </nav>

        {/* Bottom Sign Out */}
        <div style={{ marginTop: 'auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <button 
            className="corely-dock-btn logout-btn" 
            onClick={handleLogout}
            title={`Logout (${user.username || 'admin'})`}
          >
            <LogOut size={19} />
            <span className="dock-tooltip">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Flyout More Options / Suite Drawer */}
      {suiteOpen && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '96px',
          bottom: '20px',
          width: '280px',
          background: '#202329',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '24px 18px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'slideIn 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 6px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', color: '#fff', fontWeight: 800, margin: 0 }}>Management Suite</h3>
              <p style={{ fontSize: '0.74rem', color: '#A5A8B0', margin: '2px 0 0 0' }}>All enterprise gym tools</p>
            </div>
            <button 
              onClick={() => setSuiteOpen(false)}
              style={{ background: 'none', border: 'none', color: '#A5A8B0', cursor: 'pointer', padding: '4px' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            {suiteItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSuiteOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    background: isActive ? 'rgba(255, 138, 50, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isActive ? '1px solid rgba(255, 138, 50, 0.35)' : '1px solid transparent',
                    color: isActive ? '#FF8A32' : '#E2E8F0',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.15s'
                  }}
                  className="suite-link-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={17} color={isActive ? '#FF8A32' : '#A5A8B0'} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight size={14} color="#5C6070" />
                </NavLink>
              );
            })}
          </div>

          <div style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            color: '#A5A8B0'
          }}>
            <Sparkles size={14} color="#FF8A32" />
            <span>Workout Masters Pro &bull; Multiverse Sync Active</span>
          </div>
        </div>
      )}
    </>
  );
}
