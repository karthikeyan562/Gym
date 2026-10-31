import React, { useState, useEffect, useRef } from 'react';
import { Flame, Volume2, VolumeX, ArrowRight, Sparkles, FastForward } from 'lucide-react';

export default function GymIntroVideo({ isOpen, onEnter }) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);

  // Synthesize an energetic athletic electronic pulse bass using Web Audio API
  const startSynthBeat = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      setAudioPlaying(true);

      const ctx = audioCtxRef.current;
      const playKick = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.36);
      };

      playKick();
      intervalRef.current = setInterval(playKick, 680); // 88 BPM pulse
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  };

  const stopSynthBeat = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.suspend();
      } catch {}
    }
    setAudioPlaying(false);
  };

  const toggleSound = () => {
    if (audioPlaying) {
      stopSynthBeat();
    } else {
      startSynthBeat();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            handleEnterClick();
          }, 400);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.suspend();
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnterClick = () => {
    stopSynthBeat();
    onEnter();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99999,
      backgroundColor: '#05070A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      {/* Background Video Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&auto=format&fit=crop&q=80"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%) scale(1.08)',
          objectFit: 'cover',
          filter: 'brightness(0.38) contrast(1.15) saturate(1.2)',
          zIndex: 1
        }}
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-dumbbells-in-a-gym-42795-large.mp4"
          type="video/mp4"
        />
        <source
          src="https://upload.wikimedia.org/wikipedia/commons/7/70/Muscle_Strengthening_at_the_Gym_-_Chest_Press.webm"
          type="video/webm"
        />
      </video>

      {/* Dark Vignette & Mesh Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 45%, rgba(20, 25, 35, 0.4) 0%, rgba(5, 7, 10, 0.92) 80%)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Top Controls Bar */}
      <div style={{
        position: 'absolute',
        top: '28px',
        left: '36px',
        right: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, #A3E635 0%, #65A30D 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#080A0F',
            boxShadow: '0 0 30px rgba(163, 230, 53, 0.5)'
          }}>
            <Flame size={26} fill="#080A0F" />
          </div>
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.4rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              textTransform: 'uppercase'
            }}>
              CORELY <span style={{ color: '#A3E635' }}>HUD</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
              Performance & Gym Command Center
            </div>
          </div>
        </div>

        {/* Right audio and skip controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={toggleSound}
            style={{
              background: audioPlaying ? 'rgba(163, 230, 53, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: audioPlaying ? '1px solid #A3E635' : '1px solid rgba(255, 255, 255, 0.15)',
              color: audioPlaying ? '#A3E635' : '#FFFFFF',
              borderRadius: '9999px',
              padding: '10px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s'
            }}
          >
            {audioPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{audioPlaying ? 'Sound Pulse: ON' : 'Audio: Muted'}</span>
          </button>

          <button
            onClick={handleEnterClick}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s'
            }}
          >
            <FastForward size={16} /> Skip Video
          </button>
        </div>
      </div>

      {/* Main Center Call to Action */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '850px',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(163, 230, 53, 0.15)',
          border: '1px solid rgba(163, 230, 53, 0.4)',
          borderRadius: '9999px',
          padding: '6px 18px',
          color: '#A3E635',
          fontSize: '0.82rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '20px',
          boxShadow: '0 0 20px rgba(163, 230, 53, 0.2)'
        }}>
          <Sparkles size={16} /> CINEMATIC GYM INTRO &bull; ELITE ACCESS
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          marginBottom: '18px',
          textShadow: '0 10px 40px rgba(0,0,0,0.8)'
        }}>
          LET'S CRUSH YOUR <span style={{
            background: 'linear-gradient(135deg, #A3E635 0%, #22C55E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>GOALS</span>
        </h1>

        <p style={{
          color: '#CBD5E1',
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
          lineHeight: 1.6,
          maxWidth: '640px',
          margin: '0 auto 36px auto',
          fontWeight: 400,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)'
        }}>
          Stay focused. Stay consistent. See the results. Complete athlete monitoring, workout telemetry, and gym management.
        </p>

        {/* Enter Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={handleEnterClick}
            style={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #FF8533 50%, #84CC16 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '18px 46px',
              borderRadius: '9999px',
              fontSize: '1.15rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: '0 10px 40px rgba(255, 107, 0, 0.45)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ENTER WORKOUT MASTERS <ArrowRight size={22} />
          </button>

          <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
            Auto-entering in {countdown}s &bull; Click to enter immediately
          </span>
        </div>
      </div>

      {/* Bottom Live Equalizer Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        zIndex: 10
      }}>
        {[40, 75, 55, 90, 60, 85, 45, 95, 65, 50].map((h, i) => (
          <div
            key={i}
            style={{
              width: '3px',
              height: `${h * 0.28}px`,
              background: '#A3E635',
              borderRadius: '2px',
              opacity: audioPlaying ? 0.9 : 0.35,
              animation: audioPlaying ? `pulse 1.${i % 5}s infinite ease-in-out` : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
