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
import { classifyReflection } from '../services/classifyService.js';

/* ── Design tokens ───────────────────────────────────────────────── */
const green = '#00450d';
const greenMid = '#1b5e20';
const ink = '#1a1c1c';
const muted = '#41493e';
const surface = '#eeeeee';
const white = '#ffffff';

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

  const [text, setText]         = useState('');
  const [saved, setSaved]       = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [pIdx, setPIdx]         = useState(0);
  const [fadePrp, setFadePrp]   = useState(true);
  const [mounted, setMounted]   = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

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
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',

        px: { xs: 2, md: '3vw' },
        py: '2vh',
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
              fontWeight: 800,
              fontSize: '1.1rem',
              color: green,
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
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'rgba(65,73,62,0.65)',
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
          flex: 1,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 252px' },
          gridTemplateRows: '1fr',
          gap: '10px',
          minHeight: 0, // critical: allows grid to stay within flex container
        }}>

          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
          }}>

            {/* CARD 1 — Header ─────────────────────────────────── */}
            <Box sx={{ ...card({ p: '18px 24px 15px', flexShrink: 0 }) }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AutoAwesomeIcon sx={{ fontSize: 10, color: green, opacity: 0.65 }} />
                <Typography sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.55rem',
                  color: green,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}>
                  Daily Practice
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '1.35rem', md: '1.7rem' },
                lineHeight: 1.22,
                letterSpacing: '-0.025em',
                color: ink,
              }}>
                {greeting}. How are we doing today? Tell us what is on your mind.
              </Typography>
            </Box>

            {/* CARD 2 — Writing canvas ─────────────────────────── */}
            <Box sx={{
              ...card({
                p: '18px 20px 14px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0,
              }),
            }}>
              {/* Rotating micro-prompt */}
              <Box sx={{
                mb: 1.5,
                flexShrink: 0,
                opacity: fadePrp ? 1 : 0,
                transition: 'opacity 0.38s ease',
              }}>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem',
                  color: 'rgba(65,73,62,0.42)',
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
                  backgroundColor: surface,
                  border: 'none',
                  borderRadius: '10px',
                  p: '16px',
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.975rem',
                  lineHeight: 1.75,
                  color: ink,
                  resize: 'none',
                  outline: 'none',
                  minHeight: 0,
                  transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
                  '&:focus': {
                    backgroundColor: '#e5e5e5',
                    boxShadow: `0 0 0 2px rgba(0,69,13,0.1)`,
                  },
                  '&::placeholder': { color: 'rgba(65,73,62,0.3)' },
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
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: overLimit ? '#ba1a1a' : 'rgba(65,73,62,0.38)',
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
                  gap: 1.5,
                  backgroundColor: saved
                    ? '#1b5e20'
                    : isEmpty
                      ? '#9aab94'
                      : '#00450d',
                  color: white,
                  px: '28px',
                  py: '11px',
                  borderRadius: '10px',
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.01em',
                  border: 'none',
                  cursor: isEmpty || loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isEmpty || saved || loading ? 'none' : '0 4px 18px rgba(0,69,13,0.28)',
                  '&:hover:not(:disabled)': {
                    backgroundColor: '#005a10',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 7px 26px rgba(0,69,13,0.35)',
                  },
                  '&:active': { transform: 'scale(0.97)' },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : saved ? 'Lets build us' : 'Lets build us'}
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
                fontWeight: 700,
                fontSize: '0.78rem',
                color: ink,
                mb: 1.25,
              }}>
                Why we reflect
              </Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.78rem',
                lineHeight: 1.68,
                color: muted,
              }}>
                Expressive writing for just a few minutes activates emotional processing, lowers cortisol, and builds self-awareness over time. The 70-word limit is intentional — constraints sharpen clarity.
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
                fontSize: '0.6rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(0,69,13,0.45)',
                mb: 1.25,
              }}>
                Research Note
              </Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.78rem',
                lineHeight: 1.65,
                color: muted,
                fontStyle: 'italic',
                mb: 1.25,
              }}>
                "Naming an emotion reduces activation in the amygdala, creating distance between feeling and reaction."
              </Typography>
              <Typography sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.65rem',
                color: 'rgba(65,73,62,0.42)',
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
                fontSize: '0.65rem',
                color: 'rgba(65,73,62,0.55)',
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
                fontSize: '0.7rem',
                color: 'rgba(65,73,62,0.42)',
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
