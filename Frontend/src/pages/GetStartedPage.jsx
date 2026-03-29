/**
 * GetStartedPage — "How are we feeling today?"
 *
 * Mood check-in page. Three gold mood buttons with filled sentiment icons.
 * Strictly follows the provided static HTML design.
 * No nav links. No account icon. No bottom nav.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Stack } from '@mui/material';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { useBackground } from '../context/BackgroundContext';


/* ── Mood options — each with its own emotional color ─────── */
/*
 * Great  → vibrant green  (energetic, thriving)
 * Good   → warm amber     (steady, warm)
 * Ok     → soft lavender  (calm, neutral, reflective)
 */
const moods = [
  {
    icon: <SentimentVerySatisfiedIcon sx={{ fontSize: 40 }} />,
    label: 'Its going great',
    bg: '#a8e6a1',   // soft mint-green
    bgHover: '#8cd684',   // slightly deeper on hover
    textColor: '#1b5e20',   // dark forest green text
    iconColor: '#2e7d32',   // rich green icon
    glowShadow: '0 20px 50px rgba(46, 125, 50, 0.18)',
    borderHover: '#c8f7c5',
  },
  {
    icon: <SentimentSatisfiedIcon sx={{ fontSize: 40 }} />,
    label: 'Its Going good',
    bg: '#fec330',   // warm gold (original)
    bgHover: '#f5b800',
    textColor: '#6f5100',
    iconColor: '#8d6e00',
    glowShadow: '0 20px 50px rgba(254, 195, 48, 0.2)',
    borderHover: '#ffdfa0',
  },
  {
    icon: <SentimentNeutralIcon sx={{ fontSize: 40 }} />,
    label: 'Its going ok',
    bg: '#d4c8f5',   // soft lavender
    bgHover: '#c4b5ed',
    textColor: '#3a2d6b',   // deep plum text
    iconColor: '#5c49a3',   // muted violet icon
    glowShadow: '0 20px 50px rgba(92, 73, 163, 0.15)',
    borderHover: '#e4dcfa',
  },
];

export default function GetStartedPage() {
  const navigate = useNavigate();
  const { setMood } = useBackground();

  const handleMoodSelect = (moodLabel) => {
    const moodMapping = {
      'Its going great': 'Great',
      'Its Going good': 'Good',
      'Its going ok': 'Ok'
    };
    setMood(moodMapping[moodLabel] || 'Good');
    navigate('/reflect');
  };



  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        position: 'relative',
        px: 3,
        pt: '100px',
        pb: '100px',
      }}
    >
      {/* ── Centered radial glow (behind content) ──────────── */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          width: '100%',
          maxWidth: '72rem',
          aspectRatio: '1 / 1',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'var(--accent)',
            filter: 'blur(120px)',
          }}
        />
      </Box>

      {/* ── Content ────────────────────────────────────────── */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Hero Statement */}
        <Box sx={{ mb: { xs: 8, md: 10 } }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontWeight: 850,
              fontSize: { xs: '4.5rem', md: '6rem' },
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              mb: { xs: 3, md: 4 },
              transition: 'color 0.5s ease',
            }}
          >
            How are we feeling today?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            A moment of reflection to anchor your journey. Choose the state that resonates most with your present self.
          </Typography>


        </Box>

        {/* Mood Buttons — each with its own emotional color */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            mt: { xs: 4, md: 6 },
          }}
        >
          {moods.map((mood) => (
            <Box
              key={mood.label}
              component="button"
              onClick={() => handleMoodSelect(mood.label)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: mood.bg,
                color: mood.iconColor,
                px: 6,
                py: 5,
                borderRadius: '16px',
                minWidth: 260,
                width: { xs: '100%', md: 'auto' },
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:hover': {
                  backgroundColor: mood.bgHover,
                  transform: 'translateY(-8px) scale(1.03)',
                  boxShadow: mood.glowShadow,
                },
                '&:active': {
                  transform: 'scale(0.96)',
                },
              }}
            >
              <Box sx={{ mb: 2.5, color: mood.iconColor, transform: 'scale(1.2)' }}>
                {mood.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.01em',
                  color: mood.textColor,
                }}
              >
                {mood.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>

  );
}
