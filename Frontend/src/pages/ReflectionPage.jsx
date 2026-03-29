/**
 * ReflectionPage — Daily Practice · No-scroll Bento Layout
 *
 * Fits entirely within 100vh. No scrolling. No mood picker.
 * Each component is a bento card tile in a CSS grid.
 */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Fade, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useBackground } from '../context/BackgroundContext';
import { classifyReflection } from '../services/classifyService.js';


/* ── Design tokens ───────────────────────────────────────────────── */
// Colors now primarily driven by CSS variables in index.css
const green = 'var(--accent)';
const greenMid = 'var(--accent)';
const ink = 'var(--text-primary)';
const muted = 'var(--text-secondary)';
const surface = 'rgba(255, 255, 255, 0.1)';
const white = 'var(--card-surface)';


/* ── Rotating micro-prompts ──────────────────────────────────────── */
const PROMPTS = [
  'What is one thing that made you pause today?',
  'Describe the moment you felt most like yourself.',
  'What are you holding onto that you\'re ready to let go of?',
  'What surprised you about today?',
  'What do you wish you\'d said or done differently?',
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ── Shared bento card style ─────────────────────────────────────── */
const card = (extra = {}) => ({
  backgroundColor: white,
  borderRadius: '14px',
  border: '1px solid rgba(192,201,187,0.2)',
  overflow: 'hidden',
  ...extra,
});

export default function ReflectionPage() {
  const navigate = useNavigate();
  const textRef = useRef(null);

  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [pIdx, setPIdx] = useState(0);
  const [fadePrp, setFadePrp] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());
  const { mood } = useBackground();


  const maxWords = 70;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const overLimit = wordCount > maxWords;
  const isEmpty = text.trim().length === 0;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  /* Entry fade */
  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  /* Keep greeting in sync with real clock — update every minute */
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* Rotate prompts every 6s */
  useEffect(() => {
    const id = setInterval(() => {
      setFadePrp(false);
      setTimeout(() => { setPIdx(i => (i + 1) % PROMPTS.length); setFadePrp(true); }, 380);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const handleSave = async () => {
    if (isEmpty || loading) return;
    setLoading(true);
    setApiError('');
    try {
      const result = await classifyReflection(text);
      setSaved(true);
      // Navigate to dashboard, passing the Gemini result in router state
      setTimeout(() => navigate('/dashboard', { state: { classification: result } }), 600);
    } catch (err) {
      console.error('[classify] Error:', err);
      setApiError('Could not connect to the backend. Is it running?');
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        px: { xs: 2, md: '3vw' },
        pt: '100px', // More space for TopBar
        pb: '5vh',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        boxSizing: 'border-box',
      }}
    >

      {/* ── Max-width wrapper ──────────────────────────────────────── */}
      <Box sx={{
        maxWidth: 1200,
        width: '100%',
        mx: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2vh',
      }}>

        {/* ── Top bar ───────────────────────────────────────────────── */}
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

        {/* ══════════════════════════════════════════════════════════
            BENTO GRID — fills remaining vertical space
            Left: 1fr   Right: 260px fixed
        ══════════════════════════════════════════════════════════ */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 300px' },
          gap: '20px',
        }}>


          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
          }}>

            {/* CARD 1 — Header ─────────────────────────────────── */}
            <Box sx={{ ...card({ p: '32px 40px', flexShrink: 0, backdropFilter: 'blur(10px)' }) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <AutoAwesomeIcon sx={{ fontSize: 16, color: 'var(--accent)', opacity: 0.9 }} />
                <Typography sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 850,
                  fontSize: '0.85rem',
                  color: 'var(--accent)',
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
                color: 'var(--text-primary)',
              }}>
                {greeting}. {
                  mood === 'Great' ? "Fantastic. What's adding to your light today?" :
                  mood === 'Good'  ? "Steady rhythm. What is on your mind?" :
                  "Stillness. Share whatever is surfacing for you."
                }
              </Typography>



            </Box>


            {/* CARD 2 — Writing canvas ─────────────────────────── */}
            <Box sx={{
              ...card({
                p: '40px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backdropFilter: 'blur(10px)',
              }),
            }}>
              {/* Rotating micro-prompt */}
              <Box sx={{
                mb: 2.5,
                opacity: fadePrp ? 1 : 0,
                transition: 'opacity 0.38s ease',
              }}>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                }}>
                  {PROMPTS[pIdx]}
                </Typography>


              </Box>

              {/* Textarea — grows to fill card */}
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
                  color: 'var(--text-primary)',
                  resize: 'none',
                  outline: 'none',
                  minHeight: 300,
                  transition: 'all 0.3s ease',
                  '&:focus': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'var(--accent)',
                  },
                  '&::placeholder': { color: 'var(--text-secondary)', opacity: 0.5 },
                  display: 'block',
                  boxSizing: 'border-box',
                }}
              />


              {/* Word count + over-limit */}
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
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s ease',
                }}>
                  {wordCount} / {maxWords} words
                </Typography>


              </Box>
            </Box>

            {/* Save Reflection — plain button, no card wrapper */}
            <Box sx={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Box
                component="button"
                onClick={handleSave}
                disabled={isEmpty || saved || loading}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: saved
                    ? 'var(--accent)'
                    : isEmpty
                      ? 'rgba(0,0,0,0.1)'
                      : 'var(--accent)',
                  color: white,
                  px: '40px',
                  py: '18px',
                  borderRadius: '14px',
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  letterSpacing: '0.01em',
                  border: 'none',
                  cursor: isEmpty || loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isEmpty || saved || loading ? 'none' : '0 10px 30px rgba(0,0,0,0.15)',
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
            {apiError && (
              <Fade in>
                <Typography sx={{ textAlign: 'right', mt: 1, color: '#ba1a1a', fontSize: '0.75rem', fontFamily: '"Inter", sans-serif', fontWeight: 500 }}>
                  {apiError}
                </Typography>
              </Fade>
            )}
          </Box>

          {/* ── RIGHT COLUMN ─────────────────────────────────────── */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
          }}>

            {/* CARD 4 — Why we reflect ────────────────────────── */}
            <Box sx={{ ...card({ p: '20px 18px', flexShrink: 0 }) }}>
              <Typography sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 850,
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                mb: 1.25,
              }}>
                Why we reflect
              </Typography>


              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                lineHeight: 1.68,
                color: 'var(--text-secondary)',
              }}>
                Expressive writing for just a few minutes activates emotional processing, lowers cortisol, and builds self-awareness over time. The 70-word limit is intentional, constraints sharpen clarity.
              </Typography>


            </Box>

            {/* CARD 5 — Research quote ────────────────────────── */}
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
                color: 'var(--text-primary)',
                mb: 1.25,
              }}>
                Research Note
              </Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 800,
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
                mb: 1.25,
              }}>
                "Naming an emotion reduces activation in the amygdala, creating distance between feeling and reaction."
              </Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
              }}>
                — Lieberman et al., 2007 · UCLA
              </Typography>


            </Box>

            {/* CARD 6 — Editorial image (fills remaining space) ── */}
            <Box sx={{
              ...card({ position: 'relative' }),
              flex: 1,
              minHeight: 0,
            }}>
              <Box
                component="img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcTXvY480fm1Tk6JOi6Rujzq0NMRbpWCllBrgq-uHAKsuCoBlzw9TXULW8NJ8IaCRN6QGjael5oSK4uBqrN3F9GHsCHZe6De88aodVNfU-mh-8AKLErhgkR4zN_tYmFIQ0qwSoKuj3AGDLm2AXeklQDRalsM11_c_jRPNr--HOtZ3aFh7KGoSHKjNpQuncj75TDmC4eOdFPyKW-IrWhUFvL5NtFpYDwL28SKcNtYTuMtHRfF7HXXkD8uqDCE-ouvPjF0ovVY1DJMU"
                alt="Minimalist journaling desk"
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
                color: 'var(--text-secondary)',
                fontStyle: 'italic',

              }}>
                Make space for stillness.
              </Typography>

            </Box>

            {/* CARD 7 — Privacy note ──────────────────────────── */}
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
                color: 'var(--text-secondary)',
                lineHeight: 1.45,

              }}>
                This reflection is private. Only you can see it.
              </Typography>

            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}
