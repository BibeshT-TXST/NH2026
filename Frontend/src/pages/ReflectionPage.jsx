/**
 * ReflectionPage.jsx — Daily Practice & Emotional Processing
 *
 * An immersive, no-scroll Bento-style layout designed for focused 
 * expressive writing. Uses a CSS grid to present therapeutic prompts, 
 * a dynamic writing canvas, and grounding research notes.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Fade, CircularProgress } from '@mui/material';

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Context & Services
import { useBackground } from '../context/BackgroundContext';
import { classifyReflection } from '../services/classifyService.js';



// ── Design Tokens ──────────────────────────────────────────────────────────

const white  = 'var(--card-surface)';
const ink    = 'var(--text-primary)';
const muted  = 'var(--text-secondary)';
const accent = 'var(--accent)';

/**
 * Shared Bento Card Base Style
 */
const card = (extra = {}) => ({
  backgroundColor: white,
  borderRadius: '14px',
  border: '1px solid rgba(192,201,187,0.2)',
  overflow: 'hidden',
  ...extra,
});

// ── Configuration: Therapeutic Prompts ────────────────────────────────────

/**
 * A rotating set of micro-prompts designed to stimulate 
 * self-awareness and emotional labeling.
 */
const PROMPTS = [
  'What is one thing that made you pause today?',
  'Describe the moment you felt most like yourself.',
  'What are you holding onto that you\'re ready to let go of?',
  'What surprised you about today?',
  'What do you wish you\'d said or done differently?',
];

/**
 * Determines the time-appropriate greeting for the header.
 */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}


// ── Root Component ──────────────────────────────────────────────────────────

export default function ReflectionPage() {
  const navigate = useNavigate();
  const textRef  = useRef(null);

  // States
  const [text, setText]         = useState('');
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [pIdx, setPIdx]         = useState(0);
  const [fadePrp, setFadePrp]   = useState(true);
  const [mounted, setMounted]   = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  // Context
  const { mood } = useBackground();



  const maxWords = 70;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const overLimit = wordCount > maxWords;
  const isEmpty = text.trim().length === 0;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // ── Lifecycle & Effects ──────────────────────────────────────────────────

  /**
   * Entry animation trigger
   */
  useEffect(() => { 
    const timer = setTimeout(() => setMounted(true), 60); 
    return () => clearTimeout(timer);
  }, []);

  /**
   * Clock synchronization for the greeting text.
   */
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  /**
   * Automatic micro-prompt rotation (with cross-fade).
   */
  useEffect(() => {
    const id = setInterval(() => {
      setFadePrp(false);
      setTimeout(() => { 
        setPIdx(i => (i + 1) % PROMPTS.length); 
        setFadePrp(true); 
      }, 380);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * handleSave
   * Submits the reflection text for AI classification and 
   * transitions to the dashboard.
   */
  const handleSave = async () => {
    if (isEmpty || loading) return;
    
    setLoading(true);
    setApiError('');
    
    try {
      const result = await classifyReflection(text);
      setSaved(true);
      
      // Navigate to dashboard, passing the Gemini result in router state
      setTimeout(() => {
        navigate('/dashboard', { state: { classification: result } });
      }, 600);
      
    } catch (err) {
      console.error('[classify] Error:', err);
      setApiError('Unable to analyze reflection. Please check your connection.');
      setLoading(false);
    }
  };


  // ── Internal Layout: BENTO GRID ─────────────────────────────────────────

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        px: { xs: 2, md: '3vw' },
        pt: '100px',
        pb: '5vh',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{
        maxWidth: 1200,
        width: '100%',
        mx: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2vh',
      }}>

        {/* ── SECTION: Header & Date ────────────────────────────────── */}
        
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          px: '2px',
        }}>
          <Typography
            onClick={() => navigate('/dashboard')}
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 850,
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
              '&:hover': { opacity: 0.75 },
            }}
          >
            Lets Build Us
          </Typography>

          <Typography sx={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--text-secondary)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            {todayStr}
          </Typography>
        </Box>

        {/* ── SECTION: Bento Core Grid ──────────────────────────────── */}
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 300px' },
          gap: '20px',
        }}>

          {/* 🔗 LEFT COLUMN: Writing & Focus Area */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
          }}>

            {/* CARD: Welcome & Adaptive Question */}
            <Box sx={{ ...card({ p: '32px 40px', flexShrink: 0, backdropFilter: 'blur(10px)' }) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <AutoAwesomeIcon sx={{ fontSize: 16, color: accent, opacity: 0.9 }} />
                <Typography sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 850,
                  fontSize: '0.85rem',
                  color: accent,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}>
                  Daily Practice
                </Typography>
              </Box>

              <Typography sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 850,
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: ink,
              }}>
                {greeting}. {
                  mood === 'Great' ? "Fantastic. What's adding to your light today?" :
                  mood === 'Good'  ? "Steady rhythm. What is on your mind?" :
                  "Stillness. Share whatever is surfacing for you."
                }
              </Typography>
            </Box>

            {/* CARD: Writing Canvas */}
            <Box sx={{
              ...card({
                p: '40px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(10px)',
              }),
            }}>
              {/* Active Prompt Container */}
              <Box sx={{ mb: 2.5, opacity: fadePrp ? 1 : 0, transition: 'opacity 0.38s ease' }}>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: muted,
                  fontStyle: 'italic',
                }}>
                  {PROMPTS[pIdx]}
                </Typography>
              </Box>

              {/* Reflection Input Field */}
              <Box
                ref={textRef}
                component="textarea"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Type your reflection here..."
                sx={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(0,0,0,0.05)',
                  borderRadius: '16px',
                  p: '24px',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 500,
                  lineHeight: 1.8,
                  color: ink,
                  resize: 'none',
                  outline: 'none',
                  minHeight: 300,
                  transition: 'all 0.3s ease',
                  '&:focus': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: accent,
                  },
                  '&::placeholder': { color: muted, opacity: 0.5 },
                  display: 'block',
                  boxSizing: 'border-box',
                }}
              />

              {/* Status Row: Word Count & Limits */}
              <Box sx={{
                flexShrink: 0,
                mt: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
              }}>
                {overLimit && (
                  <Fade in>
                    <Typography sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.72rem',
                      color: '#ba1a1a',
                      fontWeight: 500,
                    }}>
                      Trim to 70 words — brevity unlocks clarity.
                    </Typography>
                  </Fade>
                )}
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: muted,
                  transition: 'color 0.2s ease',
                }}>
                  {wordCount} / {maxWords} words
                </Typography>
              </Box>
            </Box>

            {/* Submission Area */}
            <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Box
                component="button"
                onClick={handleSave}
                disabled={isEmpty || saved || loading}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: saved ? accent : (isEmpty ? 'rgba(0,0,0,0.1)' : accent),
                  color: white,
                  px: '40px',
                  py: '18px',
                  borderRadius: '14px',
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.01em',
                  border: 'none',
                  cursor: (isEmpty || loading) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (isEmpty || saved || loading) ? 'none' : '0 10px 30px rgba(0,0,0,0.15)',
                  '&:hover:not(:disabled)': {
                    filter: 'brightness(1.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                  },
                  '&:active': { transform: 'scale(0.97)' },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Lets build us'}
              </Box>
            </Box>

            {/* Error Message Dispatch */}
            {apiError && (
              <Fade in>
                <Typography sx={{ 
                  textAlign: 'right', 
                  mt: 1, 
                  color: '#ba1a1a', 
                  fontSize: '0.75rem', 
                  fontFamily: '"Inter", sans-serif', 
                  fontWeight: 500 
                }}>
                  {apiError}
                </Typography>
              </Fade>
            )}
          </Box>

          {/* 🔗 RIGHT COLUMN: Context & Resources */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
          }}>

            {/* CARD: The Core Why */}
            <Box sx={{ ...card({ p: '20px 18px', flexShrink: 0 }) }}>
              <Typography sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 850,
                fontSize: '0.85rem',
                color: ink,
                mb: 1.25,
              }}>
                Why we reflect
              </Typography>

              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                lineHeight: 1.68,
                color: muted,
              }}>
                Expressive writing activates emotional processing and builds self-awareness. 
                The 70-word limit is intentional — constraints sharpen clarity.
              </Typography>
            </Box>

            {/* CARD: Academic Evidence */}
            <Box sx={{
              ...card({ p: '18px 18px', flexShrink: 0 }),
              borderLeft: `3px solid rgba(0,69,13,0.18)`,
              backgroundColor: 'rgba(0,69,13,0.025)',
            }}>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 850,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: ink,
                mb: 1.25,
              }}>
                Research Note
              </Typography>
              
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                lineHeight: 1.65,
                color: muted,
                fontStyle: 'italic',
                mb: 1.25,
              }}>
                "Naming an emotion reduces activation in the amygdala, creating distance between feeling and reaction."
              </Typography>
              
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: muted,
              }}>
                — Lieberman et al.
              </Typography>
            </Box>

            {/* CARD: Visual Atmosphere (Bento Fill) */}
            <Box sx={{
              ...card({ position: 'relative' }),
              flex: 1,
              minHeight: 0,
            }}>
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcTXvY480fm1Tk6JOi6Rujzq0NMRbpWCllBrgq-uHAKsuCoBlzw9TXULW8NJ8IaCRN6QGjael5oSK4uBqrN3F9GHsCHZe6De88aodVNfU-mh-8AKLErhgkR4zN_tYmFIQ0qwSoKuj3AGDLm2AXeklQDRalsM11_c_jRPNr--HOtZ3aFh7KGoSHKjNpQuncj75TDmC4eOdFPyKW-IrWhUFvL5NtFpYDwL28SKcNtYTuMtHRfF7HXXkD8uqDCE-ouvPjF0ovVY1DJMU"
                alt="Minimalist stillness"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)',
                  opacity: 0.68,
                  display: 'block',
                  transition: 'opacity 0.3s ease',
                  '&:hover': { opacity: 0.85 },
                }}
              />
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(255,255,255,0.65) 0%, transparent 50%)',
              }} />
              <Typography sx={{
                position: 'absolute',
                bottom: 12,
                left: 14,
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: muted,
                fontStyle: 'italic',
              }}>
                Make space for stillness.
              </Typography>
            </Box>

            {/* CARD: Operational Metadata (Privacy) */}
            <Box sx={{
              ...card({
                p: '11px 16px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
              }),
            }}>
              <Typography sx={{ fontSize: '0.8rem', lineHeight: 1 }}>🔒</Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: muted,
                lineHeight: 1.45,
              }}>
                This reflection is local and private.
              </Typography>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}

