import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Plus,
  Play,
  UserPlus,
  CalendarPlus,
  Dumbbell,
  AlertCircle,
  X,
  CheckCircle2,
  Droplet,
  Flame,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { getStoredUser, setStoredUser, removeAuthToken } from '../api/apiClient';

export default function Navbar({ onToggleSidebar, onOpenIntro, onShowToast }) {
  const navigate = useNavigate();
  const user = getStoredUser() || { fullName: 'Alex Johnson', username: 'alex', joiningDate: 'Jan 2024' };
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: '2 Subscriptions Expiring Soon',
      desc: 'Sophia Rodriguez & Jessica Miller expire in < 7 days',
      time: '10m ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'GymSync Pro Telemetry Active',
      desc: 'Connected to heart rate & barbell velocity sensors',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Workout Goal Crushed!',
      desc: 'Weekly target of 300 active minutes achieved',
      time: '3h ago',
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (onShowToast) onShowToast('All notifications marked as read', 'info');
  };

  const handleSwitchProfile = (name, joining) => {
    const updated = { ...user, fullName: name, joiningDate: joining };
    setStoredUser(updated);
    setShowProfileMenu(false);
    if (onShowToast) onShowToast(`Active profile switched to ${name}`, 'success');
  };

  return (
    <header className="wm-top-header">
      {/* LEFT: Corely Runner Brand matching screenshot */}
      <div className="wm-header-brand-section">
        <button 
          className="circle-icon-btn d-lg-none" 
          onClick={onToggleSidebar} 
          aria-label="Toggle Navigation"
          style={{ display: 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          {/* Circular Corely Runner Icon from screenshot */}
          <div className="corely-logo-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h3l2 3h4l1-2" />
              <circle cx="12" cy="4" r="2" />
            </svg>
          </div>
          <span className="corely-brand-text" style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: '0.02em' }}>
            WORKOUT <span style={{ color: 'var(--accent-orange)' }}>MASTERS</span>
          </span>
        </div>
      </div>

      {/* CENTER: Clean Motivational Headline from Screenshot */}
      <div className="wm-header-center-headline">
        <h1 className="wm-headline-title">
          Let's crush your goals today
        </h1>
        <p className="wm-headline-subtitle">
          Stay focused. Stay consistent. See the results.
        </p>
      </div>

      {/* RIGHT: Notifications, Quick Add, User Profile Pill */}
      <div className="wm-header-actions">
        {/* Watch Intro Replay Pill */}
        {onOpenIntro && (
          <button
            onClick={onOpenIntro}
            className="header-pill-intro-btn"
            title="Replay Gym Cinematic Intro"
          >
            <Play size={13} fill="#A5FF38" color="#A5FF38" />
            <span>Cinematic Intro</span>
          </button>
        )}

        {/* Circular Notification Bell matching screenshot */}
        <div style={{ position: 'relative' }}>
          <button 
            className="corely-circle-btn" 
            title="Notifications"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickAdd(false);
              setShowProfileMenu(false);
            }}
          >
            <Bell size={18} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="notification-dot" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="corely-dropdown-menu" style={{ width: '330px', right: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.92rem', color: '#fff', margin: 0, fontWeight: 700 }}>Telemetry Alerts</h4>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: '0.7rem', background: '#A5FF38', color: '#101114', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={markAllRead}
                    style={{ background: 'none', border: 'none', color: '#A5FF38', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Mark read
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    style={{ background: 'none', border: 'none', color: '#A5A8B0', cursor: 'pointer' }}
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: item.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.type === 'warning' ? (
                      <AlertCircle size={18} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : item.type === 'success' ? (
                      <CheckCircle2 size={18} color="#A5FF38" style={{ flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <Flame size={18} color="#FF8A32" style={{ flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: item.read ? '#CBD5E1' : '#FFFFFF' }}>{item.title}</div>
                      <div style={{ fontSize: '0.74rem', color: '#A5A8B0', marginTop: '2px' }}>{item.desc}</div>
                      <div style={{ fontSize: '0.68rem', color: '#5C6070', marginTop: '4px' }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Circular Plus Button matching screenshot */}
        <div style={{ position: 'relative' }}>
          <button 
            className="corely-circle-btn" 
            title="Quick Options"
            onClick={() => {
              setShowQuickAdd(!showQuickAdd);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
          >
            <Plus size={20} strokeWidth={2.2} />
          </button>

          {/* Quick Options Dropdown */}
          {showQuickAdd && (
            <div className="corely-dropdown-menu" style={{ width: '230px', right: 0 }}>
              <div style={{ padding: '4px 8px 8px 8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.76rem', color: '#A5A8B0', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}>
                  Quick Options
                </span>
              </div>

              <button
                onClick={() => { setShowQuickAdd(false); navigate('/members'); }}
                className="dropdown-action-item"
              >
                <UserPlus size={16} color="#A5FF38" />
                <span>Add Member</span>
              </button>
              <button
                onClick={() => { setShowQuickAdd(false); navigate('/sessions'); }}
                className="dropdown-action-item"
              >
                <CalendarPlus size={16} color="#38BDF8" />
                <span>Schedule Session</span>
              </button>
              <button
                onClick={() => { setShowQuickAdd(false); navigate('/equipment'); }}
                className="dropdown-action-item"
              >
                <Dumbbell size={16} color="#FF8A32" />
                <span>Add Equipment</span>
              </button>
              <button
                onClick={() => { 
                  setShowQuickAdd(false); 
                  if (onShowToast) onShowToast('Hydration logged: +250ml water intake', 'success'); 
                }}
                className="dropdown-action-item"
              >
                <Droplet size={16} color="#A5FF38" />
                <span>Quick Log Water</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill matching screenshot: Alex Johnson, Joining: Jan 2024 */}
        <div style={{ position: 'relative' }}>
          <div 
            className="corely-user-profile-pill" 
            title="Athlete Profile"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowQuickAdd(false);
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80" 
              alt="Alex Johnson" 
              className="corely-avatar"
            />
            <div className="corely-user-meta">
              <span className="corely-user-name">
                {user.fullName || 'Alex Johnson'}
              </span>
              <span className="corely-user-joining">
                Joining, {user.joiningDate || 'Jan 2024'}
              </span>
            </div>
            <ChevronDown size={14} color="#64748B" style={{ marginLeft: '4px' }} />
          </div>

          {/* Profile Switcher Menu */}
          {showProfileMenu && (
            <div className="corely-dropdown-menu" style={{ width: '250px', right: 0 }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{user.fullName}</div>
                <div style={{ fontSize: '0.74rem', color: '#A5FF38', fontWeight: 600 }}>Elite Athlete &bull; Active Tier</div>
              </div>

              <div style={{ padding: '4px 10px', fontSize: '0.72rem', color: '#A5A8B0', textTransform: 'uppercase', fontWeight: 700 }}>
                Switch Persona
              </div>

              <button
                onClick={() => handleSwitchProfile('Alex Johnson', 'Jan 2024')}
                className="dropdown-action-item"
              >
                <User size={15} color="#A5FF38" />
                <span>Alex Johnson (Athlete)</span>
              </button>
              <button
                onClick={() => handleSwitchProfile('Sarah Connor', 'Mar 2024')}
                className="dropdown-action-item"
              >
                <User size={15} color="#38BDF8" />
                <span>Sarah Connor (Pro Member)</span>
              </button>
              <button
                onClick={() => handleSwitchProfile('Viktor Kane', 'Head Coach')}
                className="dropdown-action-item"
              >
                <ShieldCheck size={15} color="#FF8A32" />
                <span>Viktor Kane (Trainer)</span>
              </button>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '6px', paddingTop: '6px' }}>
                <button
                  onClick={() => {
                    removeAuthToken();
                    navigate('/login');
                  }}
                  className="dropdown-action-item"
                  style={{ color: '#EF4444' }}
                >
                  <LogOut size={15} color="#EF4444" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
