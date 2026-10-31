import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import GymIntroVideo from './components/GymIntroVideo';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import Trainers from './pages/Trainers';
import TrainingSessions from './pages/TrainingSessions';
import Equipment from './pages/Equipment';
import Home from './pages/Home';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';

import { getAuthToken } from './api/apiClient';

function ProtectedRoute({ children }) {
  const token = getAuthToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function MainLayout({ onShowToast, globalSearch, setGlobalSearch, onOpenIntro }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="workout-masters-shell">
      <div className="app-frame">
        <Sidebar 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
          onOpenIntro={onOpenIntro}
        />
        <div className="app-viewport">
          <Navbar
            onToggleSidebar={() => setMobileOpen(!mobileOpen)}
            searchValue={globalSearch}
            onSearch={setGlobalSearch}
            onOpenIntro={onOpenIntro}
            onShowToast={onShowToast}
          />
          <Routes>
            <Route path="/" element={<Dashboard onShowToast={onShowToast} onOpenIntro={onOpenIntro} />} />
            <Route path="/members" element={<Members onShowToast={onShowToast} globalSearch={globalSearch} />} />
            <Route path="/subscriptions" element={<Subscriptions onShowToast={onShowToast} />} />
            <Route path="/payments" element={<Payments onShowToast={onShowToast} />} />
            <Route path="/trainers" element={<Trainers onShowToast={onShowToast} />} />
            <Route path="/sessions" element={<TrainingSessions onShowToast={onShowToast} />} />
            <Route path="/equipment" element={<Equipment onShowToast={onShowToast} />} />
            <Route path="/maintenance" element={<Maintenance onShowToast={onShowToast} />} />
            <Route path="/reports" element={<Reports onShowToast={onShowToast} />} />
            <Route path="/home" element={<Home onShowToast={onShowToast} onOpenIntro={onOpenIntro} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [toasts, setToasts] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  // Play gym video before entering into webpage as requested
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('wm_intro_seen');
  });

  const handleEnterFromIntro = () => {
    sessionStorage.setItem('wm_intro_seen', 'true');
    setShowIntro(false);
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleCloseToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BrowserRouter>
      {/* Cinematic Gym Video Intro overlay before entering webpage */}
      <GymIntroVideo
        isOpen={showIntro}
        onEnter={handleEnterFromIntro}
      />

      <Routes>
        <Route path="/login" element={<Login onShowToast={showToast} onOpenIntro={() => setShowIntro(true)} />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout
                onShowToast={showToast}
                globalSearch={globalSearch}
                setGlobalSearch={setGlobalSearch}
                onOpenIntro={() => setShowIntro(true)}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toast toasts={toasts} onClose={handleCloseToast} />
    </BrowserRouter>
  );
}
