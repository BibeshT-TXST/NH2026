/**
 * BackgroundLayer.jsx — Global Media Orchestration
 *
 * Manages the immersive background video and ambient audio layers. 
 * Implements a robust double-buffered cross-fade system to ensure 
 * seamless transitions between different mood states (Great, Good, Ok) 
 * without visual or auditory popping.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useBackground } from '../context/BackgroundContext';

// ── Asset Registry ─────────────────────────────────────────────────────────

import GreatMusic from '../assets/Music/Great.mp3';
import GoodMusic  from '../assets/Music/Good.mp3';
import OkMusic    from '../assets/Music/Ok.mp3';

import GreatVideo from '../assets/Video/Great.mp4';
import GoodVideo  from '../assets/Video/Good.mp4';
import OkVideo    from '../assets/Video/Ok.mp4';


// ── Configuration ──────────────────────────────────────────────────────────

/**
 * MOOD_CONFIG
 * Defines the technical parameters for each aesthetic state.
 * volume: Target gain for the audio layer.
 * speed: Playback rate for both video and audio.
 */
const MOOD_CONFIG = {
  Great: { music: GreatMusic, video: GreatVideo, volume: 0.20, speed: 0.8  },
  Good:  { music: GoodMusic,  video: GoodVideo,  volume: 0.25, speed: 0.75 },
  Ok:    { music: OkMusic,    video: OkVideo,    volume: 0.15, speed: 0.7  },
};


// ── Root Component ──────────────────────────────────────────────────────────

export default function BackgroundLayer() {
  const { mood } = useBackground();
  
  // ── State: Double Buffering ──────────────────────────────────────────────
  
  // Primary and secondary layers for smooth cross-fading
  const [primary, setPrimary]     = useState({ mood: 'Good', opacity: 1, volume: 0.25 });
  const [secondary, setSecondary] = useState({ mood: null,   opacity: 0, volume: 0    });
  
  const [isPrimaryActive, setIsPrimaryActive] = useState(true);

  // Refs for direct DOM manipulation (Audio/Video APIs)
  const primaryVideoRef   = useRef(null);
  const secondaryVideoRef = useRef(null);
  const primaryAudioRef   = useRef(null);
  const secondaryAudioRef = useRef(null);
  const transitionRef     = useRef(null);


  // ── Lifecycle: Initialization ─────────────────────────────────────────────

  /**
   * Initial setup and autoplay policy handling.
   */
  useEffect(() => {
    const config = MOOD_CONFIG['Good'];
    const activeAudio = primaryAudioRef.current;
    
    if (activeAudio) {
      activeAudio.volume = config.volume;
      activeAudio.playbackRate = config.speed;
      
      const playPromise = activeAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Blocked by browser autoplay policy, wait for user interaction
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
      if (primaryAudioRef.current)   primaryAudioRef.current.pause();
      if (secondaryAudioRef.current) secondaryAudioRef.current.pause();
      if (transitionRef.current)     clearInterval(transitionRef.current);
    };
  }, []);


  // ── Mood Transition Logic ───────────────────────────────────────────────

  /**
   * Manages the "swap" between primary and secondary buffers 
   * when the global mood state changes.
   */
  useEffect(() => {
    const currentActiveMood = isPrimaryActive ? primary.mood : secondary.mood;
    if (mood === currentActiveMood) return;

    const nextMood = mood;
    const config   = MOOD_CONFIG[nextMood];

    if (isPrimaryActive) {
      // Transition from Primary -> Secondary
      setSecondary({ mood: nextMood, opacity: 0, volume: 0 });
      setIsPrimaryActive(false);
      
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
      // Transition from Secondary -> Primary
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


  /**
   * animateTransition
   * Performs the mathematical interpolation for the cross-fade.
   * Uses ease-in-out for natural volume/opacity curves.
   */
  const animateTransition = (toSecondary) => {
    if (transitionRef.current) clearInterval(transitionRef.current);

    let progress   = 0;
    const duration = 2000; // 2 second crossfade
    const interval = 40;
    const steps    = duration / interval;

    const fromMood = toSecondary ? primary.mood : secondary.mood;
    const toMood   = mood;

    const fromConfig = MOOD_CONFIG[fromMood] || MOOD_CONFIG.Good;
    const toConfig   = MOOD_CONFIG[toMood];

    transitionRef.current = setInterval(() => {
      progress += 1 / steps;
      if (progress >= 1) {
        progress = 1;
        clearInterval(transitionRef.current);
        
        // Final sanity check: pause and reset the inactive layer
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

      // Smooth step easing (sine-like curve)
      const ease = progress * progress * (3 - 2 * progress);

      if (toSecondary) {
        const fromVol = Math.max(0, fromConfig.volume * (1 - ease));
        const toVol   = toConfig.volume * ease;
        setPrimary(prev => ({ ...prev, opacity: 1 - ease, volume: fromVol }));
        setSecondary(prev => ({ ...prev, opacity: ease, volume: toVol }));
      } else {
        const fromVol = Math.max(0, fromConfig.volume * (1 - ease));
        const toVol   = toConfig.volume * ease;
        setSecondary(prev => ({ ...prev, opacity: 1 - ease, volume: fromVol }));
        setPrimary(prev => ({ ...prev, opacity: ease, volume: toVol }));
      }
    }, interval);
  };


  // ── Audio Ref Sync ──────────────────────────────────────────────────────

  /**
   * Syncs the React state volumes directly to the HTML5 Audio objects
   * for sub-frame response times.
   */
  useEffect(() => {
    if (primaryAudioRef.current) {
      primaryAudioRef.current.volume = Math.min(1, Math.max(0, primary.volume));
    }
    if (secondaryAudioRef.current) {
      secondaryAudioRef.current.volume = Math.min(1, Math.max(0, secondary.volume));
    }
  }, [primary.volume, secondary.volume]);


  // ── Render Template ─────────────────────────────────────────────────────

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
      {/* 🧩 BUFFER A: Primary Layer */}
      {primary.mood && (
        <div style={{ position: 'absolute', inset: 0, opacity: primary.opacity }}>
          <video
            ref={primaryVideoRef}
            src={MOOD_CONFIG[primary.mood].video}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <audio ref={primaryAudioRef} src={MOOD_CONFIG[primary.mood].music} loop />
        </div>
      )}

      {/* 🧩 BUFFER B: Secondary Layer */}
      {secondary.mood && (
        <div style={{ position: 'absolute', inset: 0, opacity: secondary.opacity }}>
          <video
            ref={secondaryVideoRef}
            src={MOOD_CONFIG[secondary.mood].video}
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <audio ref={secondaryAudioRef} src={MOOD_CONFIG[secondary.mood].music} loop />
        </div>
      )}

      {/* ── Visual Polish Overlay ────────────────────────────────────────── */}
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

