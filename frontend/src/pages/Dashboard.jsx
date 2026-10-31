import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Flame,
  Clock,
  Zap,
  Play,
  Pause,
  Square,
  Droplet,
  ChevronRight,
  CheckCircle2,
  Dumbbell,
  Info,
  Plus,
  X,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  TrendingUp,
  Users,
  AlertTriangle,
  UserCheck,
  DollarSign
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';
import BodyMuscleHeatmap from '../components/BodyMuscleHeatmap';
import heroLifterImg from '../assets/overhead_lifter.jpg';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ onShowToast, onOpenIntro }) {
  const [activeTab, setActiveTab] = useState('hud'); // 'hud' (screenshot UI) or 'management' (CRM)
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= WORKOUT HUD STATE (MATCHING SCREENSHOT) =================
  const [workoutPlaying, setWorkoutPlaying] = useState(true);
  const [workoutSeconds, setWorkoutSeconds] = useState(1935); // 32:15
  const [workoutProgressPercent, setWorkoutProgressPercent] = useState(78);
  const [activeDevice, setActiveDevice] = useState('GymSync Pro');
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  // Today's Workouts List
  const [todayWorkouts, setTodayWorkouts] = useState([
    { id: 'bench', name: 'Bench Press', setsReps: '4 × 10', weight: '80 kg', completed: false },
    { id: 'shoulder', name: 'Shoulder Press', setsReps: '3 × 12', weight: '24 kg', completed: false },
    { id: 'lat', name: 'Lat Pulldown', setsReps: '4 × 10', weight: '65 kg', completed: false },
    { id: 'bicep', name: 'Bicep Curl', setsReps: '3 × 12', weight: '18 kg', completed: false },
  ]);

  // Add Exercise Modal State
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [newExerciseForm, setNewExerciseForm] = useState({
    name: '',
    sets: '3',
    reps: '12',
    weight: '20 kg'
  });

  // Video Demo Modal State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [activeVideoDemo] = useState({
    title: 'Bench Press Form & Scapular Retraction',
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm'
  });

  // ================= HYDRATION STATE =================
  // 8 glasses total. Screenshot shows 5 filled (2.25L / 3.0L = 75% or 68% gauge)
  const [hydrationGlasses, setHydrationGlasses] = useState([true, true, true, true, true, false, false, false]);
  const [dailyGoalLitres, setDailyGoalLitres] = useState(3.0);
  const [showGoalMenu, setShowGoalMenu] = useState(false);

  // Calculate current litres
  const filledCount = hydrationGlasses.filter(Boolean).length;
  const currentLitres = Number(((filledCount / 8) * dailyGoalLitres).toFixed(2));
  const hydrationPercent = Math.round((currentLitres / dailyGoalLitres) * 100);

  // ================= WEEKLY PROGRESS STATE =================
  const [weekFilter, setWeekFilter] = useState('This Week');
  const [showWeekFilterMenu, setShowWeekFilterMenu] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  const weekDaysData = {
    'This Week': [
      { day: 'Mon', value: 71, label: '71 min', height: '71%', isRest: false, exercises: 'Upper Body Hypertrophy (Chest, Triceps)' },
      { day: 'Tue', value: 38, label: '38 min', height: '38%', isRest: false, exercises: 'HIIT Cardio & Core Conditioning' },
      { day: 'Wed', value: 80, label: '80 min', height: '88%', isRest: false, isPeak: true, exercises: 'Legs & Calves Heavy Compound (Squats, Press)' },
      { day: 'Thu', value: 22, label: '22 min', height: '22%', isRest: false, exercises: 'Mobility, Foam Rolling & Core' },
      { day: 'Fri', value: 54, label: '54 min', height: '54%', isRest: false, exercises: 'Back & Biceps Heavy Volume' },
      { day: 'Sat', value: 35, label: '35 min', height: '35%', isRest: false, exercises: 'Active Recovery & Functional Flow' },
      { day: 'Sun', value: 0, label: 'Rest Day', height: '14%', isRest: true, exercises: 'Full Rest & Nutritional Recovery' },
    ],
    'Last Week': [
      { day: 'Mon', value: 65, label: '65 min', height: '65%', isRest: false, exercises: 'Chest & Delts' },
      { day: 'Tue', value: 45, label: '45 min', height: '45%', isRest: false, exercises: 'Cardio Engine' },
      { day: 'Wed', value: 75, label: '75 min', height: '82%', isRest: false, isPeak: true, exercises: 'Leg Day Volume' },
      { day: 'Thu', value: 30, label: '30 min', height: '30%', isRest: false, exercises: 'Core & Stretch' },
      { day: 'Fri', value: 60, label: '60 min', height: '60%', isRest: false, exercises: 'Deadlifts & Pull' },
      { day: 'Sat', value: 40, label: '40 min', height: '40%', isRest: false, exercises: 'Arm Farm & Abs' },
      { day: 'Sun', value: 0, label: 'Rest Day', height: '14%', isRest: true, exercises: 'Rest' },
    ]
  };

  const currentDays = weekDaysData[weekFilter] || weekDaysData['This Week'];

  // Timer loop for live workout telemetry
  useEffect(() => {
    let timer;
    if (workoutPlaying) {
      timer = setInterval(() => {
        setWorkoutSeconds((prev) => (prev < 2700 ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [workoutPlaying]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.warn('Dashboard fetch stats fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Toggle workout completion
  const toggleWorkout = (id) => {
    setTodayWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, completed: !w.completed } : w))
    );
    const item = todayWorkouts.find((w) => w.id === id);
    if (onShowToast) {
      if (!item?.completed) {
        onShowToast(`Completed ${item?.name}! Sets recorded.`, 'success');
      } else {
        onShowToast(`Unmarked ${item?.name}`, 'info');
      }
    }
  };

  // Add custom exercise
  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!newExerciseForm.name.trim()) return;

    const newEx = {
      id: `custom-${Date.now()}`,
      name: newExerciseForm.name,
      setsReps: `${newExerciseForm.sets} × ${newExerciseForm.reps}`,
      weight: newExerciseForm.weight,
      completed: false
    };

    setTodayWorkouts((prev) => [...prev, newEx]);
    setIsAddExerciseOpen(false);
    setNewExerciseForm({ name: '', sets: '3', reps: '12', weight: '20 kg' });
    if (onShowToast) onShowToast(`Added "${newEx.name}" to today's workout!`, 'success');
  };

  // Toggle water glass
  const toggleGlass = (index) => {
    const updated = [...hydrationGlasses];
    updated[index] = !updated[index];
    setHydrationGlasses(updated);
    if (onShowToast) {
      const isDrinking = updated[index];
      onShowToast(
        isDrinking ? 'Logged +250ml water intake! Stay hydrated.' : 'Removed water glass log.',
        isDrinking ? 'success' : 'info'
      );
    }
  };

  const addQuickWater = (ml) => {
    const countToAdd = Math.round(ml / 250);
    const updated = [...hydrationGlasses];
    let added = 0;
    for (let i = 0; i < updated.length; i++) {
      if (!updated[i] && added < countToAdd) {
        updated[i] = true;
        added++;
      }
    }
    setHydrationGlasses(updated);
    if (onShowToast) onShowToast(`Logged +${ml}ml water!`, 'success');
  };

  // Line chart setup for management tab
  const revenueLabels = stats?.monthlyRevenueTrend ? Object.keys(stats.monthlyRevenueTrend) : ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const revenueValues = stats?.monthlyRevenueTrend ? Object.values(stats.monthlyRevenueTrend) : [1450, 1820, 2250, 2680, 3100, 3420];

  const lineChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: 'Monthly Revenue ($)',
        data: revenueValues,
        borderColor: '#FF8A32',
        backgroundColor: 'rgba(255, 138, 50, 0.12)',
        borderWidth: 3,
        pointBackgroundColor: '#FF8A32',
        pointBorderColor: '#FFFFFF',
        pointHoverRadius: 6,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#202329',
        titleColor: '#FF8A32',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(255, 138, 50, 0.3)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#A5A8B0' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#A5A8B0',
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  const doughnutData = {
    labels: ['Active Members', 'Expired Subscriptions', 'Expiring Soon'],
    datasets: [
      {
        data: [
          stats?.activeMembers || 5,
          stats?.expiredSubscriptions || 1,
          stats?.expiringSoonSubscriptions || 2,
        ],
        backgroundColor: ['#A5FF38', '#EF4444', '#F59E0B'],
        borderColor: '#202329',
        borderWidth: 3,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          padding: 16,
          font: { size: 12 },
        },
      },
    },
    cutout: '72%',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Top View Mode Switcher Pill */}
      <div style={{
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          padding: '4px'
        }}>
          <button
            onClick={() => setActiveTab('hud')}
            style={{
              padding: '8px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'hud' ? 'linear-gradient(135deg, #FF8A32 0%, #FFA055 100%)' : 'transparent',
              color: activeTab === 'hud' ? '#FFFFFF' : '#A5A8B0',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'hud' ? '0 4px 18px rgba(255, 138, 50, 0.4)' : 'none'
            }}
          >
            <Zap size={16} color={activeTab === 'hud' ? '#FFFFFF' : '#A5A8B0'} fill={activeTab === 'hud' ? '#FFFFFF' : 'none'} />
            Workout HUD
          </button>

          <button
            onClick={() => setActiveTab('management')}
            style={{
              padding: '8px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: activeTab === 'management' ? 'linear-gradient(135deg, #FF8A32 0%, #FFA055 100%)' : 'transparent',
              color: activeTab === 'management' ? '#FFFFFF' : '#A5A8B0',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'management' ? '0 4px 18px rgba(255, 138, 50, 0.4)' : 'none'
            }}
          >
            <SlidersHorizontal size={16} color={activeTab === 'management' ? '#FFFFFF' : '#A5A8B0'} />
            Management Suite
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className="circle-icon-btn" 
            onClick={fetchStats} 
            title="Sync live telemetry"
            style={{ width: '38px', height: '38px' }}
          >
            <RefreshCw size={15} className={loading ? 'spin-anim' : ''} />
          </button>
          <span style={{ fontSize: '0.82rem', color: '#A5A8B0' }}>
            Telemetry: <span style={{ color: '#A5FF38', fontWeight: 700 }}>Synchronized</span>
          </span>
        </div>
      </div>

      {/* ================= MODE 1: LIVE WORKOUT HUD (MATCHING EXACT SCREENSHOT) ================= */}
      {activeTab === 'hud' && (
        <div className="wm-dashboard-grid">
          {/* LEFT 2/3 COLUMN */}
          <div className="wm-left-col">
            {/* Top Split: Hero Card (Athlete lifting dumbbells) + 4 Metrics (2x2) */}
            <div className="wm-hero-and-stats-row">
              {/* HERO ATHLETE CARD */}
              <div className="workout-hero-card">
                {/* High-res athlete pressing dumbbells overhead in moody gym */}
                <img
                  src={heroLifterImg}
                  alt="Athlete Overhead Dumbbell Press"
                  className="workout-hero-bg"
                />
                <div className="workout-hero-gradient-overlay" />

                {/* HUD Bottom Overlay matching the reference image */}
                <div className="workout-hud-bottom">
                  {/* Play/Pause & Stop Controls */}
                  <div className="hud-playback-controls">
                    <button
                      className="hud-control-btn"
                      onClick={() => {
                        setWorkoutPlaying(!workoutPlaying);
                        if (onShowToast) {
                          onShowToast(workoutPlaying ? 'Workout paused' : 'Workout resumed', 'info');
                        }
                      }}
                      title={workoutPlaying ? 'Pause Workout' : 'Resume Workout'}
                    >
                      {workoutPlaying ? <Pause size={18} /> : <Play size={18} fill="#fff" />}
                    </button>
                    <button
                      className="hud-control-btn"
                      onClick={() => {
                        setWorkoutPlaying(false);
                        setWorkoutSeconds(0);
                        if (onShowToast) onShowToast('Workout session completed & saved to telemetry log!', 'success');
                      }}
                      title="End / Reset Workout"
                    >
                      <Square size={16} />
                    </button>
                  </div>

                  {/* Progress section with segmented bar */}
                  <div className="hud-progress-section">
                    <div className="hud-progress-labels">
                      <span className="hud-progress-title">Workout progress</span>
                      <span className="hud-progress-percent">{workoutProgressPercent}% Completed</span>
                    </div>

                    {/* Segmented neon progress bar matching screenshot */}
                    <div 
                      className="hud-progress-segmented-bar"
                      title="Click segments to adjust workout progress"
                    >
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 15 ? 'orange' : ''}`}
                        onClick={() => setWorkoutProgressPercent(25)}
                      />
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 30 ? 'orange' : ''}`}
                        onClick={() => setWorkoutProgressPercent(40)}
                      />
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 45 ? 'orange-lime' : ''}`}
                        onClick={() => setWorkoutProgressPercent(55)}
                      />
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 60 ? 'orange-lime' : ''}`}
                        onClick={() => setWorkoutProgressPercent(70)}
                      />
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 75 ? 'lime' : ''}`}
                        onClick={() => setWorkoutProgressPercent(78)}
                      />
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 88 ? 'lime' : ''}`}
                        onClick={() => setWorkoutProgressPercent(90)}
                      />
                      <div 
                        className={`hud-bar-segment ${workoutProgressPercent >= 98 ? 'lime' : ''}`}
                        onClick={() => setWorkoutProgressPercent(100)}
                      />
                      <div 
                        className="hud-bar-segment"
                        onClick={() => setWorkoutProgressPercent(100)}
                      />
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.74rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {formatTimer(workoutSeconds)} / 45:00
                    </div>
                  </div>

                  {/* Device Connection Pill matching screenshot */}
                  <div style={{ position: 'relative' }}>
                    <div 
                      className="hud-device-badge"
                      onClick={() => setShowDeviceMenu(!showDeviceMenu)}
                      title="Connected Telemetry Sensor"
                    >
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#A5FF38',
                        boxShadow: '0 0 10px #A5FF38'
                      }} />
                      <span>{activeDevice}</span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.8, color: '#FFFFFF' }}>Connected</span>
                    </div>

                    {showDeviceMenu && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        right: 0,
                        marginBottom: '8px',
                        background: '#202329',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '6px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                        zIndex: 100,
                        width: '180px'
                      }}>
                        <div style={{ padding: '4px 8px', fontSize: '0.68rem', color: '#A5A8B0', textTransform: 'uppercase', fontWeight: 700 }}>
                          Select Device
                        </div>
                        {['GymSync Pro', 'Apple Watch Ultra', 'Whoop 4.0', 'Garmin Epix'].map((dev) => (
                          <button
                            key={dev}
                            onClick={() => {
                              setActiveDevice(dev);
                              setShowDeviceMenu(false);
                              if (onShowToast) onShowToast(`Switched sensor to ${dev}`, 'success');
                            }}
                            className="dropdown-action-item"
                            style={{ fontSize: '0.78rem', padding: '6px 8px' }}
                          >
                            <span>{dev}</span>
                            {activeDevice === dev && <span style={{ color: '#A5FF38' }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4 TOP-RIGHT METRIC CARDS (2x2 GRID) */}
              <div className="wm-stats-2x2-grid">
                {/* 1. Workout Sessions */}
                <div className="wm-stat-metric-card">
                  <div className="wm-stat-card-top">
                    <Activity size={17} color="#A5FF38" />
                    <span>Workout Sessions</span>
                  </div>
                  <div>
                    <div className="wm-stat-card-value">24</div>
                    <div className="wm-stat-card-trend">
                      <span>+12%</span> from last week
                    </div>
                  </div>
                  <svg className="wm-sparkline-svg" viewBox="0 0 100 24" fill="none">
                    <path
                      d="M0 16 Q15 6 30 14 T60 8 T85 15 T100 5"
                      stroke="#A5FF38"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 2. Calories Burned */}
                <div className="wm-stat-metric-card">
                  <div className="wm-stat-card-top">
                    <Flame size={17} color="#FF8A32" />
                    <span>Calories Burned</span>
                  </div>
                  <div>
                    <div className="wm-stat-card-value">3,420</div>
                    <div className="wm-stat-card-trend">
                      <span>+8</span> from last week
                    </div>
                  </div>
                  <svg className="wm-sparkline-svg" viewBox="0 0 100 24" fill="none">
                    <path
                      d="M0 18 Q20 5 40 16 T75 6 T100 12"
                      stroke="#FF8A32"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 3. Active Time */}
                <div className="wm-stat-metric-card">
                  <div className="wm-stat-card-top">
                    <Clock size={17} color="#38BDF8" />
                    <span>Active Time</span>
                  </div>
                  <div>
                    <div className="wm-stat-card-value">8h 45m</div>
                    <div className="wm-stat-card-trend">
                      <span>+15%</span> from last week
                    </div>
                  </div>
                  <svg className="wm-sparkline-svg" viewBox="0 0 100 24" fill="none">
                    <path
                      d="M0 14 Q25 20 50 10 T80 18 T100 4"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* 4. Current Streak */}
                <div className="wm-stat-metric-card">
                  <div className="wm-stat-card-top">
                    <Zap size={17} color="#EAB308" />
                    <span>Current Streak</span>
                  </div>
                  <div>
                    <div className="wm-stat-card-value">14 days</div>
                    <div className="wm-stat-card-trend">
                      <span>+2</span> from last week
                    </div>
                  </div>
                  <svg className="wm-sparkline-svg" viewBox="0 0 100 24" fill="none">
                    <path
                      d="M0 15 Q20 18 45 8 T75 14 T100 3"
                      stroke="#EAB308"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* BOTTOM 3 CARDS ROW */}
            <div className="wm-bottom-cards-row">
              {/* CARD 1: Your Progress This Week */}
              <div className="wm-dashboard-card">
                <div className="wm-card-header">
                  <h4 className="wm-card-title">Your Progress This Week</h4>
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setShowWeekFilterMenu(!showWeekFilterMenu)}
                      style={{
                        fontSize: '0.76rem',
                        color: '#94A3B8',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{weekFilter}</span>
                      <span>⌵</span>
                    </button>

                    {showWeekFilterMenu && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        background: '#121620',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '10px',
                        padding: '4px',
                        zIndex: 100,
                        width: '120px'
                      }}>
                        {['This Week', 'Last Week'].map((wk) => (
                          <button
                            key={wk}
                            onClick={() => {
                              setWeekFilter(wk);
                              setShowWeekFilterMenu(false);
                            }}
                            className="dropdown-action-item"
                            style={{ fontSize: '0.75rem', padding: '6px 8px' }}
                          >
                            {wk}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical neon lime pill bars matching screenshot */}
                <div className="week-progress-bars">
                  {currentDays.map((d) => (
                    <div 
                      key={d.day} 
                      className="day-bar-column"
                      onClick={() => setSelectedDayDetails(d)}
                      title={`Click to view ${d.day} workout: ${d.label}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div 
                        className="day-bar-value"
                        style={{
                          color: d.isPeak ? '#A5FF38' : d.isRest ? '#5C6070' : '#FFFFFF',
                          fontWeight: d.isPeak ? 800 : 600,
                          fontSize: d.isRest ? '0.64rem' : '0.74rem'
                        }}
                      >
                        {d.label}
                      </div>

                      <div 
                        className={`day-bar-pill ${d.isRest ? 'rest' : ''}`}
                        style={{
                          height: d.height,
                          ...(d.isPeak ? {
                            background: 'linear-gradient(180deg, #A5FF38 0%, #7ACC28 100%)',
                            boxShadow: '0 0 16px rgba(165, 255, 56, 0.55)'
                          } : {})
                        }}
                      />

                      <div className="day-bar-name">{d.day}</div>
                    </div>
                  ))}
                </div>

                {/* Day Details Inline Card */}
                {selectedDayDetails && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem'
                  }}>
                    <div>
                      <strong style={{ color: '#A5FF38' }}>{selectedDayDetails.day}:</strong> {selectedDayDetails.exercises}
                    </div>
                    <button
                      onClick={() => setSelectedDayDetails(null)}
                      style={{ background: 'none', border: 'none', color: '#A5A8B0', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* CARD 2: Hydration Level */}
              <div className="wm-dashboard-card">
                <div className="wm-card-header">
                  <h4 className="wm-card-title">
                    <Droplet size={17} color="#A5FF38" /> Hydration Level
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button 
                      className="circle-icon-btn" 
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => addQuickWater(250)}
                      title="Quick drink +250ml"
                    >
                      <Plus size={14} color="#A5FF38" />
                    </button>
                    <div 
                      className="circle-icon-btn" 
                      style={{ width: '28px', height: '28px', cursor: 'pointer' }}
                      onClick={() => setShowGoalMenu(!showGoalMenu)}
                      title="Set Daily Goal"
                    >
                      <Info size={14} />
                    </div>
                  </div>
                </div>

                {/* Goal Selector Menu */}
                {showGoalMenu && (
                  <div style={{
                    padding: '8px 12px',
                    marginBottom: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem'
                  }}>
                    <span>Goal Target:</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {[2.5, 3.0, 3.5].map((g) => (
                        <button
                          key={g}
                          onClick={() => { setDailyGoalLitres(g); setShowGoalMenu(false); }}
                          style={{
                            background: dailyGoalLitres === g ? '#A5FF38' : 'rgba(255,255,255,0.08)',
                            color: dailyGoalLitres === g ? '#101114' : '#fff',
                            border: 'none',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 700
                          }}
                        >
                          {g}L
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Semi-circular gauge meter matching screenshot */}
                <div className="hydration-gauge-container">
                  <svg className="gauge-svg" viewBox="0 0 100 55">
                    {/* Background Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Active Lime Progress Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 82 25"
                      fill="none"
                      stroke="url(#limeGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      style={{ filter: 'drop-shadow(0 0 6px rgba(165, 255, 56, 0.75))' }}
                    />
                    <defs>
                      <linearGradient id="limeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A5FF38" />
                        <stop offset="100%" stopColor="#7ACC28" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="gauge-center-text">
                    <div className="gauge-status-label">Normal</div>
                    <div className="gauge-status-value">{hydrationPercent}%</div>
                  </div>
                </div>

                {/* 8 Water Glasses (Interactive: click to toggle drunk/pending) */}
                <div className="water-glasses-row" title="Click glasses to log or unlog intake">
                  {hydrationGlasses.map((filled, i) => (
                    <div
                      key={i}
                      className={`water-glass-icon ${filled ? 'filled' : 'empty'}`}
                      onClick={() => toggleGlass(i)}
                      title={`Glass #${i + 1} (250ml) - Click to ${filled ? 'unmark' : 'drink'}`}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  fontSize: '0.78rem',
                  color: '#A5A8B0',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <span>Goal: <strong style={{ color: '#fff' }}>{dailyGoalLitres.toFixed(1)} L</strong></span>
                  <span>Today: <strong style={{ color: '#A5FF38' }}>{currentLitres.toFixed(2)} L</strong></span>
                </div>
              </div>

              {/* CARD 3: Today's Workout List */}
              <div className="wm-dashboard-card">
                <div className="wm-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 className="wm-card-title">Today's workout</h4>
                    <button
                      onClick={() => setIsAddExerciseOpen(true)}
                      style={{
                        background: 'rgba(165, 255, 56, 0.15)',
                        border: '1px solid rgba(165, 255, 56, 0.3)',
                        color: '#A5FF38',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                      title="Add Custom Exercise"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  <Link to="/sessions" style={{ fontSize: '0.76rem', color: '#A5FF38', fontWeight: 600, textDecoration: 'none' }}>
                    See all
                  </Link>
                </div>

                <div className="today-workouts-list">
                  {todayWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className="workout-item-row"
                      onClick={() => toggleWorkout(workout.id)}
                      style={{ opacity: workout.completed ? 0.6 : 1, cursor: 'pointer' }}
                      title="Click to check off or view"
                    >
                      <div className="workout-item-left">
                        <div 
                          className="workout-icon-bubble" 
                          style={{ color: workout.completed ? '#A5FF38' : '#FF8A32' }}
                        >
                          {workout.completed ? <CheckCircle2 size={17} /> : <Dumbbell size={17} />}
                        </div>
                        <div className="workout-item-meta">
                          <h5 style={{ textDecoration: workout.completed ? 'line-through' : 'none' }}>
                            {workout.name}
                          </h5>
                          <span>{workout.setsReps} &bull; {workout.weight}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#5C6070" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1/3 TELEMETRY PANEL */}
          <div className="wm-right-col">
            <div className="right-panel-card">
              {/* Muscle Heatmap Diagram matching screenshot */}
              <BodyMuscleHeatmap 
                onOpenDemoVideo={() => {
                  if (onOpenIntro) {
                    onOpenIntro();
                  } else {
                    setVideoModalOpen(true);
                  }
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* ================= MODE 2: MANAGEMENT SUITE (FULL CRM & ANALYTICS) ================= */}
      {activeTab === 'management' && (
        <div style={{ padding: '0 32px 32px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Executive KPI Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {/* Total Members */}
            <div className="wm-stat-metric-card">
              <div className="wm-stat-card-top">
                <Users size={18} color="#A5FF38" />
                <span>Total Members</span>
              </div>
              <div className="wm-stat-card-value">{stats?.totalMembers || 6}</div>
              <div className="wm-stat-card-trend">
                <span>{stats?.activeMembers || 5}</span> active memberships
              </div>
            </div>

            {/* Expiring Subscriptions */}
            <div className="wm-stat-metric-card">
              <div className="wm-stat-card-top">
                <AlertTriangle size={18} color="#F59E0B" />
                <span>Expiring &lt; 7 Days</span>
              </div>
              <div className="wm-stat-card-value" style={{ color: '#F59E0B' }}>
                {stats?.expiringSoonSubscriptions || 2}
              </div>
              <div className="wm-stat-card-trend">
                Requires renewal notice
              </div>
            </div>

            {/* Personal Trainers */}
            <div className="wm-stat-metric-card">
              <div className="wm-stat-card-top">
                <UserCheck size={18} color="#38BDF8" />
                <span>Personal Trainers</span>
              </div>
              <div className="wm-stat-card-value">{stats?.totalTrainers || 4}</div>
              <div className="wm-stat-card-trend">
                <span>{stats?.activeSessions || 3}</span> sessions scheduled
              </div>
            </div>

            {/* Equipment Maintenance */}
            <div className="wm-stat-metric-card">
              <div className="wm-stat-card-top">
                <Dumbbell size={18} color="#FF8A32" />
                <span>Gym Equipment</span>
              </div>
              <div className="wm-stat-card-value">{stats?.totalEquipment || 7}</div>
              <div className="wm-stat-card-trend">
                <span style={{ color: stats?.equipmentNeedingMaintenance > 0 ? '#EF4444' : '#A5FF38' }}>
                  {stats?.equipmentNeedingMaintenance || 2}
                </span> need service
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="wm-stat-metric-card">
              <div className="wm-stat-card-top">
                <DollarSign size={18} color="#A5FF38" />
                <span>Monthly Revenue</span>
              </div>
              <div className="wm-stat-card-value" style={{ color: '#A5FF38' }}>
                ${Number(stats?.monthlyRevenue || 879.95).toFixed(2)}
              </div>
              <div className="wm-stat-card-trend">
                <span>+22%</span> growth this month
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px'
          }}>
            {/* Revenue Trend Line Chart */}
            <div className="wm-dashboard-card" style={{ height: '320px' }}>
              <div className="wm-card-header">
                <h4 className="wm-card-title">
                  <TrendingUp size={18} color="#FF8A32" /> Revenue Growth Trend
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#A5A8B0' }}>Past 6 Months</span>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>

            {/* Membership Status Distribution */}
            <div className="wm-dashboard-card" style={{ height: '320px' }}>
              <div className="wm-card-header">
                <h4 className="wm-card-title">Membership Status</h4>
              </div>
              <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Subscriptions Expiring Soon & Recent Registrations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {/* Expiring Soon Table */}
            <div className="wm-dashboard-card">
              <div className="wm-card-header">
                <h4 className="wm-card-title">
                  <AlertTriangle size={17} color="#F59E0B" /> Subscriptions Expiring Within 7 Days
                </h4>
                <Link to="/subscriptions" style={{ fontSize: '0.78rem', color: '#A5FF38', fontWeight: 600 }}>
                  Manage Plans
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Plan</th>
                      <th>Expiry</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.expiringSoonList || []).map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{sub.member?.fullName}</div>
                          <div style={{ fontSize: '0.74rem', color: '#A5A8B0' }}>{sub.member?.phoneNumber}</div>
                        </td>
                        <td>{sub.planName}</td>
                        <td style={{ color: '#F59E0B', fontWeight: 700 }}>{sub.expiryDate}</td>
                        <td>
                          <Link to="/subscriptions" className="btn btn-sm btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                            Renew
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="wm-dashboard-card">
              <div className="wm-card-header">
                <h4 className="wm-card-title">
                  <Users size={17} color="#A5FF38" /> Recent Member Registrations
                </h4>
                <Link to="/members" style={{ fontSize: '0.78rem', color: '#A5FF38', fontWeight: 600 }}>
                  View All
                </Link>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Code</th>
                      <th>Joined</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentMembers || []).map((m) => (
                      <tr key={m.id}>
                        <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={m.profilePhoto}
                            alt={m.fullName}
                            style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <span style={{ fontWeight: 600, color: '#fff' }}>{m.fullName}</span>
                        </td>
                        <td style={{ fontFamily: 'monospace' }}>{m.memberCode}</td>
                        <td>{m.joiningDate}</td>
                        <td>
                          <Badge status={m.membershipStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CUSTOM EXERCISE ================= */}
      {isAddExerciseOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Add Exercise to Today's Workout</h3>
              <button className="modal-close-btn" onClick={() => setIsAddExerciseOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddExercise}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Exercise Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Incline Dumbbell Press, Cable Flyes"
                    value={newExerciseForm.name}
                    onChange={(e) => setNewExerciseForm({ ...newExerciseForm, name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Sets</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newExerciseForm.sets}
                      onChange={(e) => setNewExerciseForm({ ...newExerciseForm, sets: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reps</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newExerciseForm.reps}
                      onChange={(e) => setNewExerciseForm({ ...newExerciseForm, reps: e.target.value })}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 24 kg"
                      value={newExerciseForm.weight}
                      onChange={(e) => setNewExerciseForm({ ...newExerciseForm, weight: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddExerciseOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TECHNIQUE DEMO VIDEO ================= */}
      {videoModalOpen && (
        <div className="modal-overlay" onClick={() => setVideoModalOpen(false)}>
          <div 
            className="modal-container" 
            style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#fff' }}>{activeVideoDemo.title}</h3>
                <p style={{ fontSize: '0.74rem', color: '#A5FF38', margin: '2px 0 0 0' }}>Biomechanics & Form Execution</p>
              </div>
              <button 
                onClick={() => setVideoModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#A5A8B0', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#000', position: 'relative', aspectRatio: '16/9' }}>
              <video
                autoPlay
                controls
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <source src={activeVideoDemo.videoUrl} type="video/webm" />
              </video>
            </div>

            <div style={{ padding: '16px 20px', background: '#202329', fontSize: '0.82rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <Sparkles size={16} color="#FF8A32" />
                <strong style={{ color: '#FFFFFF' }}>Key Coaching Cues:</strong>
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.6, color: '#A5A8B0' }}>
                <li>Retract scapula and keep feet firmly planted into the floor.</li>
                <li>Lower bar with 3-second eccentric control to mid-sternum.</li>
                <li>Drive up explosively without flaring elbows excessively.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
