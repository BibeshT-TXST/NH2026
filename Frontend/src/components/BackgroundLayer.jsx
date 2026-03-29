import React, { useEffect, useRef, useState } from 'react';
import { useBackground } from '../context/BackgroundContext';

// Import Assets
import GreatMusic from '../assets/Music/Great.mp3';
import GoodMusic from '../assets/Music/Good.mp3';
import OkMusic from '../assets/Music/Ok.mp3';

import GreatVideo from '../assets/Video/Great.mp4';
import GoodVideo from '../assets/Video/Good.mp4';
import OkVideo from '../assets/Video/Ok.mp4';

const MOOD_CONFIG = {
  Great: { music: GreatMusic, video: GreatVideo, volume: 0.20, speed: 0.8 },
  Good:  { music: GoodMusic,  video: GoodVideo,  volume: 0.25, speed: 0.75 },
  Ok:    { music: OkMusic,    video: OkVideo,    volume: 0.15, speed: 0.7 },
};

export default function BackgroundLayer() {
  const { mood } = useBackground();
  
  // We use two sets of elements to perform cross-fades
  const [primary, setPrimary] = useState({ mood: 'Good', opacity: 1, volume: 0.25 });
  const [secondary, setSecondary] = useState({ mood: null, opacity: 0, volume: 0 });
  const [isPrimaryActive, setIsPrimaryActive] = useState(true);

  const primaryVideoRef = useRef(null);
  const secondaryVideoRef = useRef(null);
  const primaryAudioRef = useRef(null);
  const secondaryAudioRef = useRef(null);

  const transitionRef = useRef(null);

  useEffect(() => {
    // Initial setup and autoplay attempt
    const config = MOOD_CONFIG['Good'];
    const activeAudio = primaryAudioRef.current;
    
    if (activeAudio) {
      activeAudio.volume = config.volume;
      activeAudio.playbackRate = config.speed;
      
      const playPromise = activeAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Blocked by browser, wait for user interaction
          const handleFirstClick = () => {
            if (primaryAudioRef.current) primaryAudioRef.current.play();
            if (primaryVideoRef.current) primaryVideoRef.current.play();
            window.removeEventListener('mousedown', handleFirstClick);
          };
          window.addEventListener('mousedown', handleFirstClick);
        });
      }
    }
    
    if (primaryVideoRef.current) {
        primaryVideoRef.current.playbackRate = config.speed;
    }

    return () => {
      // Robust cleanup on unmount
      if (primaryAudioRef.current) primaryAudioRef.current.pause();
      if (secondaryAudioRef.current) secondaryAudioRef.current.pause();
      if (transitionRef.current) clearInterval(transitionRef.current);
    };
  }, []);


  useEffect(() => {
    const currentMood = isPrimaryActive ? primary.mood : secondary.mood;
    if (mood === currentMood) return;

    // Start transition
    const nextMood = mood;
    const config = MOOD_CONFIG[nextMood];

    if (isPrimaryActive) {
      setSecondary({ mood: nextMood, opacity: 0, volume: 0 });
      setIsPrimaryActive(false);
      
      // Delay slightly to allow state to propagate then start playing
      setTimeout(() => {
        if (secondaryVideoRef.current) {
          secondaryVideoRef.current.playbackRate = config.speed;
          secondaryVideoRef.current.play().catch(() => {});
        }
        if (secondaryAudioRef.current) {
          secondaryAudioRef.current.playbackRate = config.speed;
          secondaryAudioRef.current.play().catch(() => {});
        }
        animateTransition(true); 
      }, 50);
    } else {
      setPrimary({ mood: nextMood, opacity: 0, volume: 0 });
      setIsPrimaryActive(true);

      setTimeout(() => {
        if (primaryVideoRef.current) {
          primaryVideoRef.current.playbackRate = config.speed;
          primaryVideoRef.current.play().catch(() => {});
        }
        if (primaryAudioRef.current) {
          primaryAudioRef.current.playbackRate = config.speed;
          primaryAudioRef.current.play().catch(() => {});
        }
        animateTransition(false);
      }, 50);
    }
  }, [mood]);

  const animateTransition = (toSecondary) => {
    if (transitionRef.current) clearInterval(transitionRef.current);

    let progress = 0;
    const duration = 2000; // 2 second crossfade
    const interval = 40;
    const steps = duration / interval;

    const fromMood = toSecondary ? primary.mood : secondary.mood;
    const toMood = mood;

    const fromConfig = MOOD_CONFIG[fromMood] || MOOD_CONFIG.Good;
    const toConfig = MOOD_CONFIG[toMood];

    transitionRef.current = setInterval(() => {
      progress += 1 / steps;
      if (progress >= 1) {
        progress = 1;
        clearInterval(transitionRef.current);
        
        // Final sanity check: explicitly pause the "from" layer
        if (toSecondary) {
          if (primaryAudioRef.current) {
              primaryAudioRef.current.pause();
              primaryAudioRef.current.volume = 0;
          }
          if (primaryVideoRef.current) primaryVideoRef.current.pause();
        } else {
          if (secondaryAudioRef.current) {
              secondaryAudioRef.current.pause();
              secondaryAudioRef.current.volume = 0;
          }
          if (secondaryVideoRef.current) secondaryVideoRef.current.pause();
        }
      }

      // Smooth step easing
      const ease = progress * progress * (3 - 2 * progress);

      if (toSecondary) {
        const fromVol = Math.max(0, fromConfig.volume * (1 - ease));
        const toVol = toConfig.volume * ease;
        setPrimary(prev => ({ ...prev, opacity: 1 - ease, volume: fromVol }));
        setSecondary(prev => ({ ...prev, opacity: ease, volume: toVol }));
      } else {
        const fromVol = Math.max(0, fromConfig.volume * (1 - ease));
        const toVol = toConfig.volume * ease;
        setSecondary(prev => ({ ...prev, opacity: 1 - ease, volume: fromVol }));
        setPrimary(prev => ({ ...prev, opacity: ease, volume: toVol }));
      }
    }, interval);
  };

  useEffect(() => {
    // Sync volumes directly to refs for immediate response
    if (primaryAudioRef.current) {
        primaryAudioRef.current.volume = Math.min(1, Math.max(0, primary.volume));
    }
    if (secondaryAudioRef.current) {
        secondaryAudioRef.current.volume = Math.min(1, Math.max(0, secondary.volume));
    }
  }, [primary.volume, secondary.volume]);


  return (
    <div className="background-layer" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Primary Layer */}
      {primary.mood && (
        <div style={{ position: 'absolute', inset: 0, opacity: primary.opacity }}>
          <video
            ref={primaryVideoRef}
            src={MOOD_CONFIG[primary.mood].video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <audio
            ref={primaryAudioRef}
            src={MOOD_CONFIG[primary.mood].music}
            loop
          />
        </div>
      )}

      {/* Secondary Layer */}
      {secondary.mood && (
        <div style={{ position: 'absolute', inset: 0, opacity: secondary.opacity }}>
          <video
            ref={secondaryVideoRef}
            src={MOOD_CONFIG[secondary.mood].video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <audio
            ref={secondaryAudioRef}
            src={MOOD_CONFIG[secondary.mood].music}
            loop
          />
        </div>
      )}

      {/* Premium UI Overlay — enhances readability of content above */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'var(--bg-overlay)',
        backdropFilter: 'blur(2px) saturate(105%)',
        transition: 'background 0.5s ease',
      }} />


    </div>
  );
}
