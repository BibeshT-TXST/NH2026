import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Audio Engine (Web Audio API — no external files needed) ─── */
function createAmbientEngine(ctx) {
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.connect(ctx.destination);

    // Soft drone — two detuned oscillators
    const makeOsc = (freq, type = "sine", detune = 0) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        o.detune.value = detune;
        g.gain.value = 0.08;
        o.connect(g);
        g.connect(master);
        o.start();
        return { o, g };
    };

    const drone1 = makeOsc(110, "sine", 0);
    const drone2 = makeOsc(110, "sine", 4);
    const drone3 = makeOsc(220, "triangle", -3);

    // Slow LFO on master for gentle swell
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();

    return {
        fadeIn() {
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
            master.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 2.5);
        },
        fadeOut() {
            master.gain.cancelScheduledValues(ctx.currentTime);
            master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
            master.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
        },
        releaseChime() {
            // Bright chime when shred completes
            [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.type = "sine";
                o.frequency.value = freq;
                g.gain.setValueAtTime(0, ctx.currentTime);
                g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01 + i * 0.06);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4 + i * 0.06);
                o.connect(g);
                g.connect(ctx.destination);
                o.start(ctx.currentTime + i * 0.06);
                o.stop(ctx.currentTime + 1.5 + i * 0.06);
            });
        },
        playShredSweep() {
            const duration = 1.8;
            const bufferSize = ctx.sampleRate * duration;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + duration * 0.8);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.2);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

            noise.connect(filter).connect(gain).connect(ctx.destination);
            noise.start(ctx.currentTime);
        },
    };
}

/* ─── Particle system for shred effect ─── */
function createParticles(text) {
    return Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 40 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 0.5,
        char: text[Math.floor(Math.random() * text.length)] || "·",
        opacity: 1,
        scale: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8,
    }));
}

const STAGES = {
    IDLE: "idle",
    WRITING: "writing",
    READY: "ready",
    SHREDDING: "shredding",
    RELEASED: "released",
};

export default function CognitiveDefusionCard() {
    const [stage, setStage] = useState(STAGES.IDLE);
    const [text, setText] = useState("");
    const [particles, setParticles] = useState([]);
    const [shredProgress, setShredProgress] = useState(0); // 0→1
    const [musicOn, setMusicOn] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const audioCtxRef = useRef(null);
    const engineRef = useRef(null);
    const rafRef = useRef(null);
    const particleRef = useRef([]);
    const shredRef = useRef(0);
    const textareaRef = useRef(null);

    /* ── Audio init ── */
    function ensureAudio() {
        if (!audioCtxRef.current) {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            audioCtxRef.current = ctx;
            engineRef.current = createAmbientEngine(ctx);
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    }

    function toggleMusic() {
        ensureAudio();
        if (musicOn) {
            engineRef.current.fadeOut();
        } else {
            engineRef.current.fadeIn();
        }
        setMusicOn(v => !v);
    }

    /* ── Typing ── */
    function handleChange(e) {
        setText(e.target.value);
        if (stage === STAGES.IDLE || stage === STAGES.WRITING) {
            setStage(e.target.value.trim() ? STAGES.WRITING : STAGES.IDLE);
        }
    }

    /* ── Shred ── */
    const startShred = useCallback(() => {
        if (!text.trim()) return;
        ensureAudio();
        engineRef.current?.playShredSweep();

        const parts = createParticles(text);
        particleRef.current = parts;
        setParticles([...parts]);
        shredRef.current = 0;
        setShredProgress(0);
        setStage(STAGES.SHREDDING);

        const startTime = performance.now();
        const duration = 1800;

        function animate(now) {
            const t = Math.min((now - startTime) / duration, 1);
            shredRef.current = t;
            setShredProgress(t);

            // Update particles
            particleRef.current = particleRef.current.map(p => ({
                ...p,
                x: p.x + p.vx * (1 + t * 4),
                y: p.y + p.vy * (1 + t * 3),
                opacity: Math.max(0, 1 - t * 1.1),
                rotation: p.rotation + p.rotSpeed,
                scale: p.scale * (1 - t * 0.6),
            }));
            setParticles([...particleRef.current]);

            if (t < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setStage(STAGES.RELEASED);
                setText("");
                engineRef.current?.releaseChime();
            }
        }

        rafRef.current = requestAnimationFrame(animate);
    }, [text]);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

    function reset() {
        setStage(STAGES.IDLE);
        setText("");
        setParticles([]);
        setShredProgress(0);
    }

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Karla:wght@300;400;500&display=swap');

        .cd-card {
          width: 360px;
          background: linear-gradient(160deg, #faf7f2 0%, #f5f0e8 100%);
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
        }

        .cd-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 80% 10%, rgba(255,190,100,0.1) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 90%, rgba(200,140,80,0.07) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Header */
        .cd-header {
          margin-bottom: 20px;
          position: relative;
        }

        .cd-eyebrow {
          font-size: 9.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(160,110,50,0.55);
          margin-bottom: 4px;
          font-weight: 400;
        }

        .cd-title {
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          font-weight: 400;
          color: #2c1a08;
          line-height: 1.2;
        }

        .cd-title em {
          font-style: italic;
          color: #b85c18;
        }

        .cd-info-btn {
          position: absolute;
          top: 0; right: 0;
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 1.5px solid rgba(180,120,60,0.3);
          background: rgba(255,210,140,0.15);
          color: rgba(160,100,40,0.7);
          font-size: 11px;
          font-family: 'Karla', sans-serif;
          font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .cd-info-btn:hover { background: rgba(255,210,140,0.3); color: #7a3e10; }

        /* Info panel */
        .cd-info-panel {
          background: rgba(255,240,210,0.55);
          border: 1px solid rgba(200,150,80,0.2);
          border-radius: 14px;
          padding: 13px 14px;
          margin-bottom: 18px;
          font-size: 11px;
          color: rgba(100,60,20,0.7);
          line-height: 1.6;
          font-weight: 300;
        }

        .cd-info-panel strong {
          color: #8b4513;
          font-weight: 500;
        }

        /* Textarea area */
        .cd-textarea-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .cd-textarea {
          width: 100%;
          min-height: 110px;
          background: rgba(255,255,255,0.6);
          border: 1.5px solid rgba(200,150,80,0.25);
          border-radius: 16px;
          padding: 14px 16px;
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 400;
          color: #2c1a08;
          line-height: 1.6;
          resize: none;
          outline: none;
          transition: border-color 0.3s, box-shadow 0.3s;
          box-shadow: 0 2px 12px rgba(180,130,60,0.06) inset;
          caret-color: #b85c18;
        }

        .cd-textarea::placeholder {
          color: rgba(180,130,70,0.35);
          font-style: italic;
          font-size: 13.5px;
        }

        .cd-textarea:focus {
          border-color: rgba(200,130,60,0.5);
          box-shadow: 0 0 0 3px rgba(200,130,60,0.08), 0 2px 12px rgba(180,130,60,0.06) inset;
        }

        .cd-textarea:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Shred overlay on textarea */
        .cd-shred-overlay {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          pointer-events: none;
          overflow: hidden;
        }

        /* Blur veil */
        .cd-blur-veil {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          backdrop-filter: blur(0px);
          transition: backdrop-filter 0.1s;
        }

        /* Particles */
        .cd-particle-layer {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          overflow: hidden;
          pointer-events: none;
        }

        .cd-particle {
          position: absolute;
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          color: rgba(80,40,10,0.7);
          user-select: none;
          will-change: transform, opacity;
        }

        /* Meta row */
        .cd-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .cd-counter {
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(160,110,50,0.4);
          font-weight: 400;
        }

        /* Release button */
        .cd-release-btn {
          width: 100%;
          padding: 13px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-family: 'Karla', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.06em;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }

        .cd-release-btn.inactive {
          background: rgba(210,170,100,0.1);
          color: rgba(160,110,50,0.35);
          cursor: not-allowed;
          border: 1.5px dashed rgba(200,150,80,0.2);
        }

        .cd-release-btn.active {
          background: linear-gradient(135deg, #c96a1a, #a04010);
          color: #fff8f2;
          box-shadow: 0 6px 20px rgba(180,80,20,0.28);
        }

        .cd-release-btn.active:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 26px rgba(180,80,20,0.38);
        }

        .cd-release-btn.active:active { transform: translateY(0); }

        .cd-release-btn.shredding {
          background: linear-gradient(135deg, #8b3010, #6a2008);
          color: rgba(255,240,220,0.7);
          cursor: not-allowed;
        }

        /* Shred progress bar */
        .cd-progress-bar {
          height: 2px;
          background: rgba(200,150,80,0.12);
          border-radius: 2px;
          margin-bottom: 14px;
          overflow: hidden;
        }

        .cd-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f5a040, #e05520);
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        /* Released state */
        .cd-released {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 0 6px;
          animation: cdFadeUp 0.6s ease;
        }

        @keyframes cdFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cd-released-glyph {
          font-size: 38px;
          margin-bottom: 12px;
        }

        .cd-released-title {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          font-weight: 400;
          color: #2c1a08;
          margin-bottom: 6px;
        }

        .cd-released-title em { font-style: italic; color: #b85c18; }

        .cd-released-body {
          font-size: 11.5px;
          color: rgba(100,60,20,0.5);
          line-height: 1.7;
          font-weight: 300;
          margin-bottom: 20px;
          max-width: 270px;
        }

        .cd-released-science {
          background: rgba(255,230,180,0.35);
          border: 1px solid rgba(200,150,80,0.18);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 10.5px;
          color: rgba(120,70,20,0.6);
          line-height: 1.6;
          margin-bottom: 20px;
          font-weight: 300;
          text-align: left;
        }

        .cd-released-science strong { color: #8b4513; font-weight: 500; }

        /* Footer row */
        .cd-footer {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .cd-footer-btn {
          flex: 1;
          padding: 10px;
          border-radius: 13px;
          border: none;
          font-family: 'Karla', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cd-btn-ghost {
          background: rgba(210,150,70,0.09);
          color: rgba(120,70,20,0.6);
          border: 1px solid rgba(210,150,70,0.18);
        }

        .cd-btn-ghost:hover { background: rgba(210,150,70,0.16); color: #7a3e10; }

        .cd-btn-warm {
          background: linear-gradient(135deg, #e07830, #c95520);
          color: #fff8f2;
          box-shadow: 0 4px 14px rgba(200,90,30,0.25);
        }

        .cd-btn-warm:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(200,90,30,0.35); }

        /* Music toggle */
        .cd-music-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 7px;
          margin-bottom: 16px;
        }

        .cd-music-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(160,110,50,0.5);
          text-transform: uppercase;
        }

        .cd-music-toggle {
          width: 34px; height: 18px;
          border-radius: 18px;
          border: 1.5px solid rgba(200,140,70,0.3);
          background: rgba(255,255,255,0.4);
          position: relative;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s;
        }

        .cd-music-toggle.on {
          background: linear-gradient(135deg, #e07830, #c95520);
          border-color: transparent;
        }

        .cd-music-knob {
          position: absolute;
          top: 1.5px; left: 1.5px;
          width: 13px; height: 13px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 0.25s;
        }

        .cd-music-toggle.on .cd-music-knob { transform: translateX(15px); }

        /* Divider */
        .cd-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(200,150,80,0.18), transparent);
          margin: 16px 0;
        }
      `}</style>

            <div className="cd-card">
                {/* Header */}
                <div className="cd-header">
                    <div className="cd-eyebrow">ACT · Cognitive Defusion</div>
                    <div className="cd-title">
                        Release the <em>thought,</em> not yourself
                    </div>
                    <button className="cd-info-btn" onClick={() => setShowInfo(v => !v)} title="What is this?">
                        {showInfo ? "×" : "i"}
                    </button>
                </div>

                {showInfo && (
                    <div className="cd-info-panel">
                        <strong>Cognitive Defusion (ACT)</strong> — Most suffering comes from <em>fusion</em>: believing you <em>are</em> your thoughts. Writing a thought down and watching it dissolve reveals it for what it is — just characters on a screen.<br /><br />
                        <strong>2025 Meta-analysis</strong> of 13 RCTs found ACT defusion techniques significantly reduced automatic negative thoughts and improved psychological flexibility in moderate anxiety.
                    </div>
                )}

                {/* Music toggle */}
                <div className="cd-music-row">
                    <span className="cd-music-label">Ambient sound</span>
                    <div className={`cd-music-toggle ${musicOn ? "on" : ""}`} onClick={toggleMusic}>
                        <div className="cd-music-knob" />
                    </div>
                </div>

                {stage !== STAGES.RELEASED ? (
                    <>
                        {/* Textarea */}
                        <div className="cd-textarea-wrap">
                            <textarea
                                ref={textareaRef}
                                className="cd-textarea"
                                placeholder="Type your stressor, worry, or negative thought here…"
                                value={text}
                                onChange={handleChange}
                                disabled={stage === STAGES.SHREDDING}
                                style={{
                                    filter: stage === STAGES.SHREDDING
                                        ? `blur(${shredProgress * 6}px)`
                                        : "none",
                                    opacity: stage === STAGES.SHREDDING
                                        ? Math.max(0, 1 - shredProgress * 1.2)
                                        : 1,
                                    transition: stage === STAGES.SHREDDING ? "none" : "filter 0.3s, opacity 0.3s",
                                }}
                            />

                            {/* Floating particles during shred */}
                            {stage === STAGES.SHREDDING && (
                                <div className="cd-particle-layer">
                                    {particles.map(p => (
                                        <span
                                            key={p.id}
                                            className="cd-particle"
                                            style={{
                                                left: `${p.x}%`,
                                                top: `${p.y}%`,
                                                opacity: p.opacity,
                                                transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
                                            }}
                                        >
                                            {p.char}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="cd-progress-bar">
                            <div
                                className="cd-progress-fill"
                                style={{ width: stage === STAGES.SHREDDING ? `${shredProgress * 100}%` : "0%" }}
                            />
                        </div>

                        {/* Meta */}
                        <div className="cd-meta">
                            <span className="cd-counter">
                                {text ? `${wordCount} word${wordCount !== 1 ? "s" : ""} · ${charCount} chars` : "Start writing…"}
                            </span>
                            {stage === STAGES.SHREDDING && (
                                <span className="cd-counter" style={{ color: "rgba(180,80,20,0.6)" }}>
                                    Dissolving…
                                </span>
                            )}
                        </div>

                        {/* CTA */}
                        <button
                            className={`cd-release-btn ${stage === STAGES.SHREDDING ? "shredding" :
                                stage === STAGES.WRITING ? "active" : "inactive"
                                }`}
                            onClick={stage === STAGES.WRITING ? startShred : undefined}
                            disabled={stage !== STAGES.WRITING}
                        >
                            {stage === STAGES.SHREDDING ? "Dissolving thought…" :
                                stage === STAGES.WRITING ? "✦  Release & Dissolve" :
                                    "Write your thought first"}
                        </button>
                    </>
                ) : (
                    /* Released state */
                    <div className="cd-released">
                        <div className="cd-released-glyph">🕊️</div>
                        <div className="cd-released-title">
                            <em>Released.</em>
                        </div>
                        <div className="cd-released-body">
                            That thought was just words. It had no physical form — only the weight you gave it. You've seen it dissolve. It was never you.
                        </div>
                        <div className="cd-released-science">
                            <strong>What just happened:</strong> You practiced <em>cognitive defusion</em> — externalizing a thought so your brain perceives it as an object, not a truth. Research shows this reduces emotional reactivity within seconds.
                        </div>
                        <div className="cd-footer" style={{ width: "100%" }}>
                            <button className="cd-footer-btn cd-btn-ghost" onClick={reset}>Done</button>
                            <button className="cd-footer-btn cd-btn-warm" onClick={reset}>Release another</button>
                        </div>
                    </div>
                )}

                <div className="cd-divider" />

                <div style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.08em",
                    color: "rgba(160,110,50,0.35)",
                    textAlign: "center",
                    fontFamily: "'Karla', sans-serif",
                }}>
                    Based on Acceptance &amp; Commitment Therapy · Not a substitute for professional help
                </div>
            </div>
        </>
    );
}
