import React, { useRef, useEffect, useState } from "react";

const FRACTAL_STAGES = {
    IDLE: 'IDLE',
    ZEN_MODE: 'ZEN_MODE'
};

const compileShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

const createProgram = (gl, vsSource, fsSource) => {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
};

export default function FractalFlowCard() {
    const canvasRef = useRef(null);
    const [stage, setStage] = useState(FRACTAL_STAGES.IDLE);
    const [showInfo, setShowInfo] = useState(false);

    // Play/Pause State
    const [isPlaying, setIsPlaying] = useState(true);

    // Mutable refs to track time without causing React re-renders of the WebGL canvas
    const isPlayingRef = useRef(true);
    isPlayingRef.current = isPlaying;

    const accumulatedTimeRef = useRef(0);
    const lastFrameTimeRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Obtain WebGL context
        const gl = canvas.getContext('webgl', {
            alpha: false,
            antialias: true,
            powerPreference: "low-power"
        });

        if (!gl) {
            console.warn("WebGL not supported");
            return;
        }

        const vsSource = `
            attribute vec4 aVertexPosition;
            void main() {
                gl_Position = aVertexPosition;
            }
        `;

        const fsSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform float u_intensity;

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
                
                float zoom = 1.35 + sin(u_time * 0.1) * 0.15;
                
                vec2 c = vec2(
                    0.285 + sin(u_time * 0.12) * 0.04 * u_intensity,
                    0.01 + cos(u_time * 0.08) * 0.04 * u_intensity
                );
                
                vec2 z = uv * zoom;
                int iter = 0;
                const int max_iter = 50;
                
                for(int i = 0; i < 50; i++) {
                    float x = (z.x * z.x - z.y * z.y) + c.x;
                    float y = (z.y * z.x + z.x * z.y) + c.y;
                    if((x * x + y * y) > 4.0) break;
                    z.x = x;
                    z.y = y;
                    iter++;
                }
                
                if (iter == max_iter) {
                    gl_FragColor = vec4(0.23, 0.20, 0.16, 1.0); 
                } else {
                    float t = float(iter) / float(max_iter);
                    
                    vec3 color1 = vec3(0.98, 0.96, 0.94); // #faf7f2 (Off-white)
                    vec3 color2 = vec3(0.88, 0.65, 0.45); // Soft orange
                    vec3 color3 = vec3(0.54, 0.27, 0.07); // #8b4513 (Rust/Brown)
                    
                    vec3 finalColor;
                    if (t < 0.5) {
                        finalColor = mix(color1, color2, t * 2.0);
                    } else {
                        finalColor = mix(color2, color3, (t - 0.5) * 2.0);
                    }
                    
                    finalColor *= 0.88 + 0.12 * sin(u_time * 0.4);
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            }
        `;

        const program = createProgram(gl, vsSource, fsSource);
        if (!program) return;

        const positions = new Float32Array([
            -1.0, 1.0,
            -1.0, -1.0,
            1.0, 1.0,
            1.0, -1.0,
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionAttrib = gl.getAttribLocation(program, 'aVertexPosition');
        gl.enableVertexAttribArray(positionAttrib);
        gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

        gl.useProgram(program);

        const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
        const timeUniform = gl.getUniformLocation(program, 'u_time');
        const intensityUniform = gl.getUniformLocation(program, 'u_intensity');

        // Reset frame time tracker when context re-initializes
        lastFrameTimeRef.current = null;

        const render = (time) => {
            if (lastFrameTimeRef.current === null) {
                lastFrameTimeRef.current = time;
            }
            const dt = time - lastFrameTimeRef.current;
            lastFrameTimeRef.current = time;

            if (isPlayingRef.current) {
                accumulatedTimeRef.current += dt;
            }

            if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
                canvas.width = canvas.clientWidth * window.devicePixelRatio;
                canvas.height = canvas.clientHeight * window.devicePixelRatio;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            const elapsedParams = accumulatedTimeRef.current * 0.001;

            gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
            gl.uniform1f(timeUniform, elapsedParams);
            gl.uniform1f(intensityUniform, stage === FRACTAL_STAGES.ZEN_MODE ? 1.0 : 0.2);

            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            gl.deleteProgram(program);
        };
    }, [stage]);

    return (
        <React.Fragment>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Karla:wght@400;500;700&display=swap');

                .ff-card {
                    flex: 0 0 360px;
                    width: 360px;
                    height: 600px;
                    border-radius: 26px;
                    position: relative;
                    overflow: hidden;
                    font-family: 'Karla', sans-serif;
                    box-shadow:
                        0 20px 60px rgba(140,100,60,0.13),
                        0 4px 20px rgba(140,100,60,0.09);
                    border: 1px solid rgba(200,160,100,0.18);
                    display: flex;
                    flex-direction: column;
                    background: #faf7f2;
                }

                .ff-canvas {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: 1;
                    pointer-events: none;
                }

                .ff-gradient-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 180px;
                    background: linear-gradient(to bottom, rgba(250,247,242,0.95) 0%, rgba(250,247,242,0) 100%);
                    z-index: 2;
                    pointer-events: none;
                }
                
                .ff-gradient-overlay-bottom {
                    position: absolute;
                    bottom: 0; left: 0; right: 0;
                    height: 220px;
                    background: linear-gradient(to top, rgba(250,247,242,1) 0%, rgba(250,247,242,0.6) 40%, rgba(250,247,242,0) 100%);
                    z-index: 2;
                    pointer-events: none;
                }

                .ff-content {
                    position: relative;
                    z-index: 10;
                    padding: 28px 26px 26px;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    box-sizing: border-box;
                }

                .ff-header {
                    margin-bottom: 20px;
                    position: relative;
                }

                .ff-eyebrow {
                    font-size: 9.5px;
                    letter-spacing: 0.24em;
                    text-transform: uppercase;
                    color: rgba(160,110,50,0.85);
                    margin-bottom: 4px;
                    font-weight: 700;
                }

                .ff-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 21px;
                    font-weight: 400;
                    color: #2c1a08;
                    line-height: 1.2;
                }

                .ff-title em {
                    font-style: italic;
                    color: #b85c18;
                }

                .ff-info-btn {
                    position: absolute; top: 0; right: 0;
                    width: 22px; height: 22px; border-radius: 50%;
                    border: 1.5px solid rgba(180,120,60,0.4);
                    background: rgba(255,255,255,0.5);
                    color: rgba(160,100,40,0.9);
                    font-size: 11px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                    backdrop-filter: blur(4px);
                }

                .ff-info-btn:hover { background: rgba(255,210,140,0.6); color: #7a3e10; }

                .ff-info-panel {
                    background: rgba(255,246,235,0.85);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(200,150,80,0.25);
                    border-radius: 14px;
                    padding: 13px 14px;
                    margin-bottom: 18px;
                    font-size: 11.5px;
                    color: rgba(100,60,20,0.85);
                    line-height: 1.6;
                }

                .ff-info-panel strong { color: #8b4513; font-weight: 500; }

                .ff-spacer {
                    flex: 1;
                }

                .ff-controls {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 10px;
                    animation: ffFadeUp 0.6s ease;
                }

                @keyframes ffFadeUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .ff-zen-btn {
                    width: 100%;
                    padding: 14px;
                    border-radius: 16px;
                    border: none;
                    font-family: 'Karla', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 14px rgba(200,90,30,0.25);
                }

                .ff-zen-btn.enter {
                    background: linear-gradient(135deg, #e07830, #c95520);
                    color: #fff8f2;
                }

                .ff-zen-btn.enter:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(200,90,30,0.35);
                }

                .ff-zen-btn.exit {
                    background: #2c1a08;
                    color: #faf7f2;
                    border: none;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    font-weight: 600;
                    backdrop-filter: none;
                }

                .ff-zen-btn.exit:hover {
                    background: #44280c;
                    transform: translateY(-2px);
                }

                .ff-zen-ui {
                    transition: opacity 1.5s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .ff-zen-ui.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
                
                .ff-zen-return {
                    transition: opacity 1.5s ease;
                    position: absolute;
                    bottom: 32px;
                    left: 26px;
                    right: 26px;
                    display: flex;
                    gap: 10px;
                    z-index: 100;
                    opacity: 0;
                    pointer-events: none;
                }

                .ff-zen-return.visible {
                    opacity: 1;
                    pointer-events: auto;
                }
            `}</style>

            <div className="ff-card">
                <canvas ref={canvasRef} className="ff-canvas" />
                <div className="ff-gradient-overlay" />

                <div className={`ff-gradient-overlay-bottom ${stage === FRACTAL_STAGES.ZEN_MODE ? 'hidden' : ''}`} style={{
                    transition: 'opacity 1.5s ease'
                }} />

                <div className="ff-content">
                    <div className={`ff-zen-ui ${stage === FRACTAL_STAGES.ZEN_MODE ? 'hidden' : ''}`}>
                        <div className="ff-header">
                            <div className="ff-eyebrow">NEURO-VISUAL · D = 1.3</div>
                            <div className="ff-title">The <em>Fractal</em> Flow</div>
                            <button className="ff-info-btn" onClick={() => setShowInfo(v => !v)}>{showInfo ? "×" : "i"}</button>
                        </div>

                        {showInfo && (
                            <div className="ff-info-panel">
                                <strong>Fractal Fluency (2025)</strong> — The human visual system has evolved to process natural, self-similar geometry with minimal effort. Viewing mathematical fractals between a specific dimension ($D = 1.3$ to $1.5$) triggers immediate parasympathetic relaxation and "effortless attention."
                            </div>
                        )}

                        <div className="ff-spacer" />

                        <div className="ff-controls">
                            <div style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "16px",
                                color: "#5c3a18",
                                textAlign: "center",
                                marginBottom: "16px",
                                fontStyle: "italic"
                            }}>
                                Focus on the center.<br />Let your eyes soften.
                            </div>
                            <button
                                className="ff-zen-btn enter"
                                onClick={() => {
                                    setStage(FRACTAL_STAGES.ZEN_MODE);
                                    setIsPlaying(true); // Always ensure playing when entering
                                }}
                            >
                                Enter Zen Mode
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`ff-zen-return ${stage === FRACTAL_STAGES.ZEN_MODE ? 'visible' : ''}`}>
                    <button
                        className="ff-zen-btn exit"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? "⏸ Pause Flow" : "▶ Resume Flow"}
                    </button>
                    <button
                        className="ff-zen-btn exit"
                        onClick={() => {
                            accumulatedTimeRef.current = 0;
                            setIsPlaying(true);
                        }}
                    >
                        ↺ Reset
                    </button>
                    <button
                        className="ff-zen-btn exit"
                        onClick={() => setStage(FRACTAL_STAGES.IDLE)}
                    >
                        End Mode
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
};
