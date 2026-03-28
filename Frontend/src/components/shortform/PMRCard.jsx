import React, { useState, useRef, useEffect } from "react";

const playExhaleSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        // Sub-bass thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);

        // Exhale white noise
        const duration = 1.5;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(ctx.currentTime);
    } catch (e) {
        console.error("Audio playback failed", e);
    }
};

const PMR_STAGES = {
    IDLE: 'IDLE',
    HOLDING: 'HOLDING',
    READY_TO_RELEASE: 'READY_TO_RELEASE',
    RELEASED: 'RELEASED'
};

const HOLD_DURATION_MS = 5000;

export default function PMRCard() {
    const [stage, setStage] = useState(PMR_STAGES.IDLE);
    const [progress, setProgress] = useState(0); // 0 to 1
    const [showInfo, setShowInfo] = useState(false);

    const holdStartTime = useRef(null);
    const rafRef = useRef(null);

    const startHolding = (e) => {
        // Prevent default touch behavior (like scrolling or magnifying)
        if (e.type === 'touchstart') {
            e.preventDefault();
        }

        if (stage === PMR_STAGES.RELEASED) return;

        setStage(PMR_STAGES.HOLDING);
        setProgress(0);
        holdStartTime.current = performance.now();

        const animate = (time) => {
            const elapsed = time - holdStartTime.current;
            const p = Math.min(elapsed / HOLD_DURATION_MS, 1);
            setProgress(p);

            if (p < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setStage(PMR_STAGES.READY_TO_RELEASE);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
    };

    const stopHolding = (e) => {
        if (e && e.type === 'touchend') {
            e.preventDefault();
        }

        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        if (stage === PMR_STAGES.READY_TO_RELEASE || progress >= 0.95) {
            // Success
            setStage(PMR_STAGES.RELEASED);
            playExhaleSound();
        } else if (stage === PMR_STAGES.HOLDING) {
            // Failed to hold long enough
            setStage(PMR_STAGES.IDLE);
            setProgress(0);
        }
    };

    const reset = () => {
        setStage(PMR_STAGES.IDLE);
        setProgress(0);
    };

    // Clean up animation on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Derived visual states
    const isHolding = stage === PMR_STAGES.HOLDING || stage === PMR_STAGES.READY_TO_RELEASE;
    const isReleased = stage === PMR_STAGES.RELEASED;

    // Background flashes green on release
    const cardBg = isReleased
        ? "linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 100%)"
        : "linear-gradient(160deg, #faf7f2 0%, #f5f0e8 100%)";

    return (
        <React.Fragment>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Karla:wght@400;500;700&display=swap');

                .pmr-card {
                    flex: 0 0 360px;
                    width: 360px;
                    height: 600px;
                    border-radius: 26px;
                    padding: 28px 26px 26px;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Karla', sans-serif;
                    box-shadow:
                        0 1px 0 rgba(255,255,255,0.95) inset,
                        0 20px 60px rgba(140,100,60,0.13),
                        0 4px 20px rgba(140,100,60,0.09);
                    border: 1px solid rgba(200,160,100,0.18);
                    display: flex;
                    flex-direction: column;
                    transition: background 0.8s ease-out, box-shadow 0.8s ease-out;
                }

                .pmr-header {
                    margin-bottom: 20px;
                    position: relative;
                    z-index: 10;
                }

                .pmr-eyebrow {
                    font-size: 9.5px;
                    letter-spacing: 0.24em;
                    text-transform: uppercase;
                    color: rgba(160,110,50,0.55);
                    margin-bottom: 4px;
                }

                .pmr-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 21px;
                    font-weight: 400;
                    color: #2c1a08;
                    line-height: 1.2;
                }

                .pmr-title em {
                    font-style: italic;
                    color: #b85c18;
                }

                .pmr-info-btn {
                    position: absolute; top: 0; right: 0;
                    width: 22px; height: 22px; border-radius: 50%;
                    border: 1.5px solid rgba(180,120,60,0.3);
                    background: rgba(255,210,140,0.15);
                    color: rgba(160,100,40,0.7);
                    font-size: 11px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }

                .pmr-info-btn:hover { background: rgba(255,210,140,0.3); color: #7a3e10; }

                .pmr-info-panel {
                    background: rgba(255,240,210,0.55);
                    border: 1px solid rgba(200,150,80,0.2);
                    border-radius: 14px;
                    padding: 13px 14px;
                    margin-bottom: 18px;
                    font-size: 11.5px;
                    color: rgba(100,60,20,0.7);
                    line-height: 1.6;
                    position: relative;
                    z-index: 10;
                }

                .pmr-info-panel strong { color: #8b4513; font-weight: 500; }

                .pmr-main-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 5;
                }

                .pmr-instruction {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    color: #2c1a08;
                    text-align: center;
                    margin-bottom: 12px;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: color 0.3s ease;
                }

                .pmr-instruction.urgent {
                    color: #d32f2f;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    animation: pulseUrgent 0.5s infinite alternate;
                }

                @keyframes pulseUrgent {
                    from { transform: scale(1); }
                    to { transform: scale(1.03); }
                }

                .pmr-instruction.success {
                    color: #2e7d32;
                    font-style: italic;
                }

                .pmr-button-container {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 30px;
                }

                .pmr-hold-btn {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #e07830, #c95520);
                    color: #fff8f2;
                    font-family: 'Karla', sans-serif;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(200,90,30,0.3);
                    position: relative;
                    z-index: 10;
                    transition: transform 0.1s;
                    user-select: none;
                    outline: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }

                .pmr-hold-btn:active, .pmr-hold-btn.active {
                    transform: scale(0.95);
                    box-shadow: 0 4px 12px rgba(200,90,30,0.4);
                }

                .pmr-hold-btn.released {
                    background: linear-gradient(135deg, #4caf50, #2e7d32);
                    box-shadow: 0 8px 24px rgba(46,125,50,0.3);
                    cursor: default;
                    transform: scale(1);
                }

                /* Outer progress ring */
                .pmr-ring-svg {
                    position: absolute;
                    top: 0; left: 0;
                    width: 180px; height: 180px;
                    transform: rotate(-90deg);
                    pointer-events: none;
                    z-index: 5;
                }

                .pmr-ring-bg {
                    fill: none;
                    stroke: rgba(200,150,80,0.15);
                    stroke-width: 8;
                }

                .pmr-ring-fill {
                    fill: none;
                    stroke: #d32f2f;
                    stroke-width: 8;
                    stroke-dasharray: 502; /* 2 * PI * 80 */
                    stroke-linecap: round;
                    transition: stroke 0.3s;
                }

                .pmr-ring-fill.ready {
                    stroke: #ff1744;
                    filter: drop-shadow(0 0 8px rgba(255,23,68,0.6));
                }

                /* Vibration effect when holding */
                .pmr-card.holding {
                    animation: slightShake 0.1s infinite alternate;
                }

                @keyframes slightShake {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(0.5px, 0.5px); }
                }

                .pmr-reset-btn {
                    padding: 12px 24px;
                    border-radius: 16px;
                    border: 1px solid rgba(46,125,50,0.3);
                    background: rgba(255,255,255,0.6);
                    color: #2e7d32;
                    font-family: 'Karla', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    animation: fadeIn 1s ease;
                }

                .pmr-reset-btn:hover {
                    background: rgba(255,255,255,0.9);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(46,125,50,0.1);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className={`pmr-card ${stage === PMR_STAGES.HOLDING ? 'holding' : ''}`} style={{ background: cardBg }}>
                <div className="pmr-header">
                    <div className="pmr-eyebrow">PMR · MUSCLE RELAXATION</div>
                    <div className="pmr-title">The <em>Reset</em> Button</div>
                    <button className="pmr-info-btn" onClick={() => setShowInfo(v => !v)}>{showInfo ? "×" : "i"}</button>
                </div>

                {showInfo && (
                    <div className="pmr-info-panel">
                        <strong>Progressive Muscle Relaxation (PMR)</strong> uses the physiological "rebound effect." By intensely tensing your muscles and suddenly releasing them, you force your nervous system to register that the threat has passed, instantly lowering cortisol.
                    </div>
                )}

                <div className="pmr-main-area">
                    {stage === PMR_STAGES.IDLE && (
                        <div className="pmr-instruction">
                            Squeeze your fists, jaw, and shoulders as hard as you can.<br /><br />
                            <span style={{ fontSize: '14px', color: 'rgba(160,110,50,0.8)' }}>Press and hold the button below.</span>
                        </div>
                    )}

                    {stage === PMR_STAGES.HOLDING && (
                        <div className="pmr-instruction">
                            Tense harder! Hold it...
                        </div>
                    )}

                    {stage === PMR_STAGES.READY_TO_RELEASE && (
                        <div className="pmr-instruction urgent">
                            NOW RELEASE EVERYTHING.
                        </div>
                    )}

                    {stage === PMR_STAGES.RELEASED && (
                        <div className="pmr-instruction success">
                            Let the heavy, warm feeling wash over you.
                        </div>
                    )}

                    {!isReleased ? (
                        <div className="pmr-button-container">
                            <svg className="pmr-ring-svg">
                                <circle className="pmr-ring-bg" cx="90" cy="90" r="80" />
                                <circle
                                    className={`pmr-ring-fill ${stage === PMR_STAGES.READY_TO_RELEASE ? 'ready' : ''}`}
                                    cx="90" cy="90" r="80"
                                    style={{
                                        strokeDashoffset: 502 - (502 * progress)
                                    }}
                                />
                            </svg>
                            <button
                                className={`pmr-hold-btn ${isHolding ? 'active' : ''}`}
                                onMouseDown={startHolding}
                                onMouseUp={stopHolding}
                                onMouseLeave={stopHolding}
                                onTouchStart={startHolding}
                                onTouchEnd={stopHolding}
                                onTouchCancel={stopHolding}
                            >
                                {stage === PMR_STAGES.READY_TO_RELEASE ? "RELEASE!" : "HOLD"}
                            </button>
                        </div>
                    ) : (
                        <div className="pmr-button-container">
                            <div className="pmr-hold-btn released">
                                <span style={{ fontSize: '32px' }}>🌿</span>
                            </div>
                        </div>
                    )}

                    {isReleased && (
                        <button className="pmr-reset-btn" onClick={reset}>
                            Repeat Reset
                        </button>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};
