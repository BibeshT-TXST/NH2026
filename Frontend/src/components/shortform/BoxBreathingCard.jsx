import React, { useState, useEffect } from 'react';

const PHASES = {
  READY: 'READY',
  INTAKE: 'INTAKE',
  HOLD: 'HOLD',
  RELEASE: 'RELEASE',
  FINISHED: 'FINISHED'
};

const PHASE_ORDER = [PHASES.INTAKE, PHASES.HOLD, PHASES.RELEASE];
const PHASE_DURATION_SECONDS = 4;
const TOTAL_CYCLES = 4;

const playAudioCue = (phase) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playBowl = (freq, duration = 6.0, maxVol = 0.05) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(maxVol, ctx.currentTime + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    };

    const playSoftBreath = (isIntake, duration = 4.0) => {
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.1;

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const gain = ctx.createGain();

      if (isIntake) {
        filter.frequency.setValueAtTime(100, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration);
      } else {
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + duration * 0.5);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    };

    if (phase === 'INTAKE') {
      playBowl(174.61, 8.0, 0.03);
      playSoftBreath(true, 4.0);
    } else if (phase === 'HOLD') {
      playBowl(220.00, 4.0, 0.015);
    } else if (phase === 'RELEASE') {
      playBowl(130.81, 8.0, 0.02);
      playSoftBreath(false, 4.0);
    } else if (phase === 'FINISHED') {
      playBowl(130.81, 6.0, 0.03);
      playBowl(164.81, 6.0, 0.02);
      playBowl(196.00, 6.0, 0.01);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

const BoxBreathingCard = () => {
  const [phase, setPhase] = useState(PHASES.READY);
  const [cycle, setCycle] = useState(1);
  const [timeLeft, setTimeLeft] = useState(PHASE_DURATION_SECONDS);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Audio playback for Box Breathing has been disabled per user request.
  }, [phase, isActive, isPaused]);

  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && phase !== PHASES.READY && phase !== PHASES.FINISHED) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handlePhaseTransition();
            return PHASE_DURATION_SECONDS;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, phase, cycle]);

  const handlePhaseTransition = () => {
    const currentPhaseIndex = PHASE_ORDER.indexOf(phase);
    if (currentPhaseIndex === PHASE_ORDER.length - 1) {
      if (cycle >= TOTAL_CYCLES) {
        setPhase(PHASES.FINISHED);
        setIsActive(false);
      } else {
        setCycle(c => c + 1);
        setPhase(PHASE_ORDER[0]);
      }
    } else {
      setPhase(PHASE_ORDER[currentPhaseIndex + 1]);
    }
  };

  const startBreathing = () => {
    if (phase === PHASES.READY || phase === PHASES.FINISHED) {
      setCycle(1);
      setTimeLeft(PHASE_DURATION_SECONDS);
      setPhase(PHASES.INTAKE);
      setIsActive(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const endSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase(PHASES.READY);
    setTimeLeft(PHASE_DURATION_SECONDS);
  };

  const getPhaseDescription = () => {
    if (isPaused) return "Session paused";
    switch (phase) {
      case PHASES.READY: return "Find a comfortable position";
      case PHASES.INTAKE: return "Draw the air in deeply";
      case PHASES.HOLD: return "Hold still — let the calm settle in";
      case PHASES.RELEASE: return "Release slowly and completely";
      case PHASES.FINISHED: return "Session complete";
      default: return "";
    }
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = isActive ? ((PHASE_DURATION_SECONDS - timeLeft) / PHASE_DURATION_SECONDS) : 0;
  const strokeDashoffset = circumference - (progressRatio * circumference);

  const renderTimerCircle = () => {
    if (phase === PHASES.READY || phase === PHASES.FINISHED) {
      return (
        <div className="breathing-circle-wrapper idle">
          <div className="ambient-ring external-1"></div>
          <div className="breathing-circle">
            <div className="icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 0 0 9-9c0-3.3-1.8-6.2-4.5-7.8" />
                <path d="M10 5a5 5 0 0 1 7 5" />
                <path d="M8 12a3 3 0 0 1 5-2" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`breathing-circle-wrapper ${phase.toLowerCase()} ${isPaused ? 'paused' : ''}`}>
        <div className="ambient-ring external-1"></div>
        <div className="ambient-ring external-2"></div>

        <svg className="progress-ring" viewBox="0 0 188 188">
          <circle
            className="progress-ring-bar"
            cx="94" cy="94" r="90"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isPaused ? strokeDashoffset : strokeDashoffset - (circumference / 4)
            }}
          />
        </svg>

        <div className="breathing-circle">
          <div className="icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21a9 9 0 0 0 9-9c0-3.3-1.8-6.2-4.5-7.8" />
              <path d="M10 5a5 5 0 0 1 7 5" />
              <path d="M8 12a3 3 0 0 1 5-2" />
            </svg>
          </div>
          <div className="time-display">{timeLeft}</div>
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      <style>{`
        /* BoxBreathingCard.css - Earthy Meditative Theme */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        :root {
          --bg-card: #fefcf9;
          --text-main: #3d342b;
          --text-accent: #c96b34;
          --text-muted: #c2ada0;
          --circle-bg: #faeedb;
          --circle-border: #bb7135;
          --btn-bg: rgba(235, 220, 205, 0.4);
          --btn-border: #e3ccb8;
          --btn-text: #664d36;
        }
        
        .box-breathing-card.theme-earthy {
          font-family: 'Inter', sans-serif;
          width: 100%;
          max-width: 440px;
          background-color: var(--bg-card);
          border-radius: 40px;
          padding: 3.5rem 2.5rem;
          box-shadow: 0 20px 50px rgba(150, 130, 110, 0.1);
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        
        .meta-caps {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        
        .card-header h2 {
          font-size: 2rem;
          font-weight: 400;
          color: var(--text-main);
          margin: 0;
          letter-spacing: -0.01em;
        }
        
        .card-header h2 .accent-italic {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-weight: 400;
          color: var(--text-accent);
        }
        
        .animation-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          height: 280px;
          margin: 2rem 0;
        }
        
        .ambient-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px solid rgba(235, 220, 205, 0.7);
          pointer-events: none;
          transition: all 4s ease;
        }
        
        .ambient-ring.external-1 { width: 230px; height: 230px; }
        .ambient-ring.external-2 { width: 270px; height: 270px; opacity: 0.5; }
        
        .breathing-circle-wrapper.intake .ambient-ring.external-1 { transform: translate(-50%, -50%) scale(1.1); }
        .breathing-circle-wrapper.intake .ambient-ring.external-2 { transform: translate(-50%, -50%) scale(1.15); }
        .breathing-circle-wrapper.release .ambient-ring.external-1 { transform: translate(-50%, -50%) scale(1); }
        .breathing-circle-wrapper.release .ambient-ring.external-2 { transform: translate(-50%, -50%) scale(1); }
        
        .breathing-circle-wrapper { position: relative; width: 180px; height: 180px; }
        
        .breathing-circle {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          border-radius: 50%;
          background-color: var(--circle-bg);
          border: 4px solid var(--circle-border);
          box-sizing: border-box;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          transition: transform 4s linear;
          box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5);
        }
        
        .breathing-circle-wrapper.intake .breathing-circle { transform: scale(1.15); }
        .breathing-circle-wrapper.hold .breathing-circle { transform: scale(1.15); }
        .breathing-circle-wrapper.release .breathing-circle { transform: scale(1); }
        
        .breathing-circle-wrapper.paused .breathing-circle,
        .breathing-circle-wrapper.paused .ambient-ring,
        .breathing-circle-wrapper.paused .progress-ring-bar { transition: none !important; }
        
        .icon { margin-bottom: 2px; }
        
        .time-display {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 400;
          color: var(--text-main);
          line-height: 1;
          margin-top: -6px;
        }
        
        .progress-ring {
          position: absolute; top: -4px; left: -4px; width: 188px; height: 188px;
          transform: rotate(-90deg);
          pointer-events: none;
          z-index: 10;
        }
        
        .progress-ring-bar {
          fill: transparent;
          stroke: var(--text-accent);
          stroke-width: 4px;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s linear;
        }
        
        .breathing-circle-wrapper.intake .progress-ring { transform: rotate(-90deg) scale(1.15); transition: transform 4s linear; }
        .breathing-circle-wrapper.hold .progress-ring { transform: rotate(-90deg) scale(1.15); }
        
        .status-row {
          display: flex; justify-content: center; align-items: center; gap: 1.25rem;
          margin-bottom: 1.5rem;
          animation: fadeIn 0.5s ease;
        }
        
        .phase-chip {
          background-color: #f2e6dc; color: #8c4217;
          padding: 0.35rem 1rem; border-radius: 100px; font-size: 0.75rem;
          font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
          border: 1px solid #e6d3c2;
        }
        
        .cycle-dots { display: flex; gap: 6px; }
        
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background-color: #ebdacf; transition: background-color 0.3s;
        }
        .dot.active { background-color: var(--text-accent); }
        
        .phase-description {
          text-align: center; color: #a38c7b; font-size: 0.95rem;
          margin: 0 0 2rem 0; animation: slideUpFade 0.4s ease forwards;
        }
        
        @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { to { opacity: 1; } }
        
        .controls-row { display: flex; gap: 1.25rem; width: 100%; }
        
        .pill-btn {
          flex: 1; background-color: var(--btn-bg); color: var(--btn-text);
          border: 1px solid var(--btn-border); border-radius: 20px;
          padding: 1rem 0; font-size: 1rem; font-weight: 500; cursor: pointer;
          transition: all 0.2s ease; font-family: inherit; display: flex;
          justify-content: center; align-items: center;
        }
        
        .pill-btn:hover { background-color: rgba(235, 220, 205, 0.6); transform: translateY(-1px); }
        .pill-btn:active { transform: scale(0.98); }
      `}</style>

      <div className="box-breathing-card theme-earthy">
        <div className="card-header">
          <div className="meta-caps">MINDFULNESS · BOX METHOD</div>
          <h2><span className="accent-italic">Breathe</span> with intention</h2>
        </div>

        <div className="card-body">
          <div className="animation-container">
            {renderTimerCircle()}
          </div>

          {phase !== PHASES.READY && phase !== PHASES.FINISHED ? (
            <div className="status-row">
              <div className="phase-chip">{phase}</div>
              <div className="cycle-dots">
                {[...Array(TOTAL_CYCLES)].map((_, i) => (
                  <span key={i} className={`dot ${i < cycle ? 'active' : ''}`}></span>
                ))}
              </div>
            </div>
          ) : (
            <div className="status-row" style={{ opacity: 0 }}><div className="phase-chip">IDLE</div></div> /* Preserves layout height */
          )}

          <p className="phase-description" key={phase + isPaused}>{getPhaseDescription()}</p>

          <div className="controls-row">
            {phase === PHASES.READY || phase === PHASES.FINISHED ? (
              <button className="pill-btn primary" onClick={startBreathing}>
                {phase === PHASES.FINISHED ? 'Start Again' : 'Begin'}
              </button>
            ) : (
              <React.Fragment>
                <button className="pill-btn" onClick={startBreathing}>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button className="pill-btn" onClick={endSession}>
                  End
                </button>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BoxBreathingCard;
