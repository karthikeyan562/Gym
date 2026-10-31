import React, { useState } from 'react';
import { Play } from 'lucide-react';

export default function BodyMuscleHeatmap({ onOpenDemoVideo }) {
  const [selectedMuscle, setSelectedMuscle] = useState('chest');
  const [repsToFailure, setRepsToFailure] = useState('1 – 2');
  const [showRirMenu, setShowRirMenu] = useState(false);

  const muscleData = {
    chest: {
      name: 'Pectoralis Major',
      zone: 'Anterior Upper Torso',
      activation: '94%',
      status: 'Prime Mover',
      color: '#84CC16',
      exercises: ['Flat Barbell Bench', 'Incline Dumbbell Press', 'Cable Crossover']
    },
    traps: {
      name: 'Trapezius & Upper Back',
      zone: 'Posterior Neck & Scapula',
      activation: '88%',
      status: 'Secondary Stabilizer',
      color: '#EAB308',
      exercises: ['Overhead Dumbbell Press', 'Barbell Shrugs', 'Face Pulls']
    },
    shoulders: {
      name: 'Anterior & Lateral Deltoids',
      zone: 'Anterior / Lateral Shoulder',
      activation: '91%',
      status: 'High Load',
      color: '#38BDF8',
      exercises: ['Dumbbell Overhead Press', 'Lateral Raises', 'Arnold Press']
    },
    lats: {
      name: 'Latissimus Dorsi',
      zone: 'Posterior Back Wing',
      activation: '82%',
      status: 'Targeted',
      color: '#A855F7',
      exercises: ['Wide Grip Lat Pulldown', 'Barbell Rows', 'Pull-ups']
    },
    biceps: {
      name: 'Biceps Brachii',
      zone: 'Anterior Upper Arm',
      activation: '79%',
      status: 'Auxiliary',
      color: '#FF6B00',
      exercises: ['Incline Dumbbell Curl', 'Preacher Curl', 'Hammer Curls']
    }
  };

  const currentInfo = muscleData[selectedMuscle] || muscleData.chest;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Header: Workout Sessions & Reps to failure */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '0.92rem', color: '#FFFFFF', margin: 0, fontWeight: 700, letterSpacing: '-0.01em' }}>
            Workout Sessions
          </h4>
          <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>
            Biomechanical Muscle Activation
          </div>
        </div>

        {/* Reps to Failure interactive pill */}
        <div style={{ textAlign: 'right', position: 'relative' }}>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600, letterSpacing: '0.04em' }}>
            Reps to failure
          </div>
          <button
            onClick={() => setShowRirMenu(!showRirMenu)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Adjust Reps to Failure target"
          >
            <span>{repsToFailure}</span>
            <span style={{ fontSize: '0.65rem', color: '#84CC16' }}>⌵</span>
          </button>

          {showRirMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: '#121620',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
              zIndex: 100,
              width: '120px'
            }}>
              {['0 (Max Out)', '1 – 2 (Hypertrophy)', '3 – 4 (Deload)'].map((rir) => (
                <button
                  key={rir}
                  onClick={() => {
                    setRepsToFailure(rir.split(' ')[0] + (rir.includes('–') ? ' – ' + rir.split(' ')[2] : ''));
                    setShowRirMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: '#F1F5F9',
                    fontSize: '0.75rem',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                  className="dropdown-action-item"
                >
                  {rir}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wireframe Anatomical Musculoskeletal Diagram */}
      <div style={{
        background: '#0D111A',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '18px',
        padding: '16px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        position: 'relative'
      }}>
        {/* FRONT ANTERIOR BODY */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.08em' }}>
            ANTERIOR
          </div>
          <svg width="90" height="175" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Silhouette wireframe */}
            {/* Head */}
            <circle cx="50" cy="18" r="11" stroke="#334155" strokeWidth="1.2" fill="#141A28" />
            <path d="M47 29h6v9h-6z" fill="#1E293B" stroke="#334155" strokeWidth="1" />

            {/* Deltoids Front */}
            <path
              d="M26 38 C32 38 38 40 43 42 L39 65 L24 50 Z"
              fill={selectedMuscle === 'shoulders' ? 'rgba(56, 189, 248, 0.3)' : '#192233'}
              stroke={selectedMuscle === 'shoulders' ? '#38BDF8' : '#334155'}
              strokeWidth="1.2"
              cursor="pointer"
              onClick={() => setSelectedMuscle('shoulders')}
            />
            <path
              d="M74 38 C68 38 62 40 57 42 L61 65 L76 50 Z"
              fill={selectedMuscle === 'shoulders' ? 'rgba(56, 189, 248, 0.3)' : '#192233'}
              stroke={selectedMuscle === 'shoulders' ? '#38BDF8' : '#334155'}
              strokeWidth="1.2"
              cursor="pointer"
              onClick={() => setSelectedMuscle('shoulders')}
            />

            {/* Biceps Front */}
            <path
              d="M24 52 L38 64 L34 94 L22 82 Z"
              fill={selectedMuscle === 'biceps' ? 'rgba(255, 107, 0, 0.3)' : '#151C2B'}
              stroke={selectedMuscle === 'biceps' ? '#FF6B00' : '#334155'}
              strokeWidth="1"
              cursor="pointer"
              onClick={() => setSelectedMuscle('biceps')}
            />
            <path
              d="M76 52 L62 64 L66 94 L78 82 Z"
              fill={selectedMuscle === 'biceps' ? 'rgba(255, 107, 0, 0.3)' : '#151C2B'}
              stroke={selectedMuscle === 'biceps' ? '#FF6B00' : '#334155'}
              strokeWidth="1"
              cursor="pointer"
              onClick={() => setSelectedMuscle('biceps')}
            />

            {/* Forearms */}
            <path d="M22 84 L32 94 L27 126 L18 120 Z" fill="#111723" stroke="#2B3648" strokeWidth="1" />
            <path d="M78 84 L68 94 L73 126 L82 120 Z" fill="#111723" stroke="#2B3648" strokeWidth="1" />

            {/* CHEST - PECTORALS (HIGHLIGHTED IN VIBRANT NEON LIME AS IN SCREENSHOT) */}
            <path
              d="M37 42 C42 42 48 45 50 51 C52 45 58 42 63 42 C70 42 74 49 72 59 C70 67 58 71 50 74 C42 71 30 67 28 59 C26 49 30 42 37 42 Z"
              fill="#84CC16"
              stroke="#A3E635"
              strokeWidth="1.8"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(132, 204, 22, 0.85))',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedMuscle('chest')}
            />
            {/* Sternum divider line */}
            <line x1="50" y1="44" x2="50" y2="72" stroke="#141A28" strokeWidth="1.5" />

            {/* Abs Core */}
            <path d="M38 74 h24 v40 h-24 z" fill="#141A28" stroke="#334155" strokeWidth="1" rx="4" />
            <line x1="50" y1="76" x2="50" y2="112" stroke="#232C3D" strokeWidth="1.5" />
            <line x1="40" y1="86" x2="60" y2="86" stroke="#232C3D" strokeWidth="1.5" />
            <line x1="40" y1="98" x2="60" y2="98" stroke="#232C3D" strokeWidth="1.5" />

            {/* Quads */}
            <path d="M36 116 L49 116 L45 160 L32 158 Z" fill="#182030" stroke="#334155" strokeWidth="1" />
            <path d="M64 116 L51 116 L55 160 L68 158 Z" fill="#182030" stroke="#334155" strokeWidth="1" />

            {/* Calves */}
            <path d="M33 162 L44 162 L41 196 L31 194 Z" fill="#121724" stroke="#263143" strokeWidth="1" />
            <path d="M67 162 L56 162 L59 196 L69 194 Z" fill="#121724" stroke="#263143" strokeWidth="1" />
          </svg>
        </div>

        {/* BACK POSTERIOR BODY */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.08em' }}>
            POSTERIOR
          </div>
          <svg width="90" height="175" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Silhouette wireframe */}
            {/* Head back */}
            <circle cx="50" cy="18" r="11" stroke="#334155" strokeWidth="1.2" fill="#141A28" />

            {/* TRAPEZIUS & UPPER NECK (HIGHLIGHTED GLOWING GOLD/YELLOW AS IN SCREENSHOT) */}
            <path
              d="M44 29 L56 29 L66 43 L50 56 L34 43 Z"
              fill="#EAB308"
              stroke="#FACC15"
              strokeWidth="1.8"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(234, 179, 8, 0.85))',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedMuscle('traps')}
            />

            {/* Lats Upper Back */}
            <path
              d="M34 48 L66 48 L61 84 L39 84 Z"
              fill={selectedMuscle === 'lats' ? 'rgba(168, 85, 247, 0.3)' : '#192233'}
              stroke={selectedMuscle === 'lats' ? '#A855F7' : '#334155'}
              strokeWidth="1.2"
              cursor="pointer"
              onClick={() => setSelectedMuscle('lats')}
            />
            {/* Spine line */}
            <line x1="50" y1="36" x2="50" y2="108" stroke="#232C3D" strokeWidth="1.5" />

            {/* Arms Back */}
            <path d="M26 40 L38 46 L32 82 L22 56 Z" fill="#151C2B" stroke="#334155" strokeWidth="1" />
            <path d="M74 40 L62 46 L68 82 L78 56 Z" fill="#151C2B" stroke="#334155" strokeWidth="1" />
            <path d="M22 84 L32 86 L27 124 L18 120 Z" fill="#111723" stroke="#2B3648" strokeWidth="1" />
            <path d="M78 84 L68 86 L73 124 L82 120 Z" fill="#111723" stroke="#2B3648" strokeWidth="1" />

            {/* Glutes */}
            <path d="M36 102 C36 114 48 116 50 110 C52 116 64 114 64 102 Z" fill="#161D2C" stroke="#334155" strokeWidth="1" />

            {/* Hamstrings */}
            <path d="M36 116 L49 116 L45 160 L32 158 Z" fill="#182030" stroke="#334155" strokeWidth="1" />
            <path d="M64 116 L51 116 L55 160 L68 158 Z" fill="#182030" stroke="#334155" strokeWidth="1" />

            {/* Calves Back */}
            <path d="M33 162 L44 162 L41 196 L31 194 Z" fill="#121724" stroke="#263143" strokeWidth="1" />
            <path d="M67 162 L56 162 L59 196 L69 194 Z" fill="#121724" stroke="#263143" strokeWidth="1" />
          </svg>
        </div>

        {/* Floating Quick Muscle Tag */}
        <div style={{
          position: 'absolute',
          bottom: '8px',
          background: 'rgba(5, 7, 10, 0.9)',
          border: `1px solid ${currentInfo.color}`,
          borderRadius: '8px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.6)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentInfo.color }} />
          <span style={{ fontSize: '0.72rem', color: '#FFFFFF', fontWeight: 700 }}>
            {currentInfo.name}: {currentInfo.activation}
          </span>
        </div>
      </div>

      {/* Mini Video / Technique Preview Thumbnail matching screenshot */}
      <div 
        className="video-thumbnail-player" 
        title="Watch Form & Exercise Technique Video"
        onClick={onOpenDemoVideo}
      >
        <img
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
          alt="Exercise Technique Demo"
        />
        <div className="video-play-center-btn">
          <Play size={16} fill="#FFFFFF" color="#FFFFFF" />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '12px',
          fontSize: '0.72rem',
          color: '#FFFFFF',
          fontWeight: 700,
          textShadow: '0 2px 6px rgba(0,0,0,0.8)'
        }}>
          Bench Press Technique &bull; 0:45
        </div>
      </div>

      {/* SUB-WIDGET 1: Workout Intensity Speedometer Gauge */}
      <div style={{
        background: '#0D111A',
        borderRadius: '16px',
        padding: '14px 16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>Workout Intensity</span>
          <span style={{ fontSize: '0.72rem', color: '#84CC16', fontWeight: 700, letterSpacing: '0.04em' }}>PEAK</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Speedometer Gauge Arc */}
          <svg width="68" height="40" viewBox="0 0 100 55">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 10 50 A 40 40 0 0 1 82 28"
              fill="none"
              stroke="#FACC15"
              strokeWidth="10"
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.7))' }}
            />
            {/* Speedometer Needle Indicator */}
            <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
            <line x1="50" y1="50" x2="72" y2="34" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              85% Strong
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
              Peak performance zone
            </div>
          </div>
        </div>
      </div>

      {/* SUB-WIDGET 2: Muscle Balance Telemetry Scale matching screenshot */}
      <div style={{
        background: '#0D111A',
        borderRadius: '16px',
        padding: '14px 16px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>Muscle Balance</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EAB308' }}>
            52 / 48
          </span>
        </div>

        {/* Balance scale dots and bar matching screenshot */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '10px 0 6px 0'
        }}>
          {/* Yellow dots scale */}
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EAB308', boxShadow: '0 0 8px #EAB308' }} />
          <div style={{ flex: 1, height: '4px', background: '#EAB308', borderRadius: '2px' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EAB308', boxShadow: '0 0 10px #EAB308' }} />
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
          Well balanced strength
        </div>
      </div>
    </div>
  );
}
