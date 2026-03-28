import React, { useState, useRef, useEffect } from "react";

const SENSES = [
  { id: 'SEE', count: 5, prompt: "things you can see", icon: "👁️", color: "#b85c18" },
  { id: 'TOUCH', count: 4, prompt: "things you can touch", icon: "🤚", color: "#a04010" },
  { id: 'HEAR', count: 3, prompt: "sounds you can currently hear", icon: "👂", color: "#8b4513" },
  { id: 'SMELL', count: 2, prompt: "scents you can smell", icon: "👃", color: "#6a2008" },
  { id: 'TASTE', count: 1, prompt: "thing you can taste", icon: "👅", color: "#4a1505" }
];

const GroundingCarouselCard = () => {
  const [senseIdx, setSenseIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [collectedData, setCollectedData] = useState({ SEE: [], TOUCH: [], HEAR: [], SMELL: [], TASTE: [] });
  const [isFinished, setIsFinished] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const inputRef = useRef(null);
  const currentSense = SENSES[senseIdx];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    setCollectedData(prev => {
      const nextData = { ...prev };
      nextData[currentSense.id] = [...nextData[currentSense.id], inputValue.trim()];
      return nextData;
    });

    setInputValue("");

    if (itemIdx < currentSense.count - 1) {
      setItemIdx(i => i + 1);
    } else {
      if (senseIdx < SENSES.length - 1) {
        setSenseIdx(s => s + 1);
        setItemIdx(0);
      } else {
        setIsFinished(true);
      }
    }
  };

  useEffect(() => {
    if (!isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [itemIdx, senseIdx, isFinished]);

  const reset = () => {
    setSenseIdx(0);
    setItemIdx(0);
    setInputValue("");
    setCollectedData({ SEE: [], TOUCH: [], HEAR: [], SMELL: [], TASTE: [] });
    setIsFinished(false);
  };

  const totalCollected = Object.values(collectedData).flat().length;
  const progressPercent = (totalCollected / 15) * 100;

  return (
    <React.Fragment>
      <style>{`
        .gc-card {
          flex: 0 0 360px;
          width: 360px;
          height: 600px;
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
          display: flex;
          flex-direction: column;
        }

        .gc-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 80% 10%, rgba(255,190,100,0.1) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 90%, rgba(200,140,80,0.07) 0%, transparent 50%);
          pointer-events: none;
        }

        .gc-header { margin-bottom: 20px; position: relative; }
        .gc-eyebrow {
          font-size: 9.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(160,110,50,0.55);
          margin-bottom: 4px;
        }
        .gc-title {
          font-family: 'Playfair Display', serif;
          font-size: 21px;
          font-weight: 400;
          color: #2c1a08;
          line-height: 1.2;
        }
        .gc-title em { font-style: italic; color: #b85c18; }
        
        .gc-info-btn {
          position: absolute; top: 0; right: 0;
          width: 22px; height: 22px; border-radius: 50%;
          border: 1.5px solid rgba(180,120,60,0.3);
          background: rgba(255,210,140,0.15);
          color: rgba(160,100,40,0.7);
          font-size: 11px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .gc-info-btn:hover { background: rgba(255,210,140,0.3); color: #7a3e10; }

        .gc-info-panel {
          background: rgba(255,240,210,0.55);
          border: 1px solid rgba(200,150,80,0.2);
          border-radius: 14px;
          padding: 13px 14px;
          margin-bottom: 18px;
          font-size: 11.5px;
          color: rgba(100,60,20,0.7);
          line-height: 1.6;
        }
        .gc-info-panel strong { color: #8b4513; font-weight: 500; }

        .gc-progress-bar {
          height: 3px;
          background: rgba(200,150,80,0.12);
          border-radius: 3px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .gc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f5a040, #a04010);
          border-radius: 3px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gc-prompt-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          animation: gcStep 0.5s ease;
        }
        
        @keyframes gcStep {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .gc-sense-icon {
          font-size: 38px;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 12px rgba(180,100,40,0.15));
        }

        .gc-sense-instruction {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #2c1a08;
          margin-bottom: 8px;
        }

        .gc-sense-meta {
          font-size: 12px;
          color: rgba(160,110,50,0.6);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 24px;
        }

        .gc-input-wrap {
          width: 100%;
          position: relative;
        }

        .gc-input {
          width: 100%;
          background: rgba(255,255,255,0.65);
          border: 1.5px solid rgba(200,150,80,0.25);
          border-radius: 16px;
          padding: 16px 20px;
          font-family: 'Karla', sans-serif;
          font-size: 15px;
          color: #2c1a08;
          text-align: center;
          outline: none;
          box-shadow: 0 2px 12px rgba(180,130,60,0.04) inset;
          transition: border-color 0.3s, box-shadow 0.3s;
          box-sizing: border-box;
        }
        .gc-input:focus {
          border-color: rgba(200,130,60,0.5);
          box-shadow: 0 0 0 3px rgba(200,130,60,0.08), 0 2px 12px rgba(180,130,60,0.04) inset;
        }

        .gc-submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #e07830, #c95520);
          color: #fff8f2;
          font-family: 'Karla', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.05em;
          margin-top: 16px;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 14px rgba(200,90,30,0.25);
        }
        .gc-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(200,90,30,0.35); }
        .gc-submit-btn:disabled { background: rgba(210,170,100,0.1); color: rgba(160,110,50,0.35); cursor: not-allowed; box-shadow: none; border: 1.5px dashed rgba(200,150,80,0.2); }

        /* Finished State */
        .gc-finished {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          animation: gcStep 0.8s ease;
        }
        
        .gc-cloud {
          flex: 1;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          gap: 6px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding-top: 10px;
        }

        .gc-pill {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(200,150,80,0.18);
          border-radius: 20px;
          padding: 5px 12px;
          font-size: 11.5px;
          color: #5c3a18;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .gc-pill em { color: #b85c18; font-style: normal; font-size: 10px; }
      `}</style>

      <div className="gc-card">
        <div className="gc-header">
          <div className="gc-eyebrow">GROUNDING · 5-4-3-2-1</div>
          <div className="gc-title">Find <em>center</em> in the present</div>
          <button className="gc-info-btn" onClick={() => setShowInfo(v => !v)}>{showInfo ? "×" : "i"}</button>
        </div>

        {showInfo && (
          <div className="gc-info-panel">
            <strong>The 54321 Technique</strong> anchors you to reality when overwhelmed. By systematically moving through your 5 senses, you force the brain's processing power away from anxious loops and into direct environmental observation.
          </div>
        )}

        <div className="gc-progress-bar">
          <div className="gc-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {!isFinished ? (
          <form className="gc-prompt-box" key={`${senseIdx}-${itemIdx}`} onSubmit={handleSubmit}>
            <div className="gc-sense-icon">{currentSense.icon}</div>
            <div className="gc-sense-instruction">
              Name {currentSense.count} {currentSense.prompt}
            </div>
            <div className="gc-sense-meta" style={{ color: currentSense.color }}>
              Item {itemIdx + 1} of {currentSense.count}
            </div>

            <div className="gc-input-wrap">
              <input
                ref={inputRef}
                className="gc-input"
                placeholder={`E.g. "${currentSense.id === 'SEE' ? 'a blue pen' : currentSense.id === 'TOUCH' ? 'the texture of a desk' : currentSense.id === 'HEAR' ? 'traffic hum' : currentSense.id === 'SMELL' ? 'coffee' : 'mint gum'}"`}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </div>
            <button type="submit" className="gc-submit-btn" disabled={!inputValue.trim()}>
              {itemIdx < currentSense.count - 1 ? 'Record & Next' : 'Record & Advance Sense'}
            </button>
          </form>
        ) : (
          <div className="gc-finished">
            <div className="gc-sense-icon">🌿</div>
            <div className="gc-sense-instruction">You are grounded.</div>
            <div className="gc-sense-meta">Here is your anchor to the present:</div>

            <div className="gc-cloud">
              {SENSES.map(sense => (
                collectedData[sense.id].map((item, idx) => (
                  <div className="gc-pill" key={`${sense.id}-${idx}`}>
                    <em>{sense.icon}</em> {item}
                  </div>
                ))
              ))}
            </div>

            <button className="gc-submit-btn" onClick={reset}>Begin Again</button>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default GroundingCarouselCard;
