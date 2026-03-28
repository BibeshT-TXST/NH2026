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
    bg:          '#a8e6a1',   // soft mint-green
    bgHover:     '#8cd684',   // slightly deeper on hover
    textColor:   '#1b5e20',   // dark forest green text
    iconColor:   '#2e7d32',   // rich green icon
    glowShadow:  '0 20px 50px rgba(46, 125, 50, 0.18)',
    borderHover: '#c8f7c5',
  },
  {
    icon: <SentimentSatisfiedIcon sx={{ fontSize: 40 }} />,
    label: 'Its Going good',
    bg:          '#fec330',   // warm gold (original)
    bgHover:     '#f5b800',
    textColor:   '#6f5100',
    iconColor:   '#8d6e00',
    glowShadow:  '0 20px 50px rgba(254, 195, 48, 0.2)',
    borderHover: '#ffdfa0',
  },
  {
    icon: <SentimentNeutralIcon sx={{ fontSize: 40 }} />,
    label: 'Its going ok',
    bg:          '#d4c8f5',   // soft lavender
    bgHover:     '#c4b5ed',
    textColor:   '#3a2d6b',   // deep plum text
    iconColor:   '#5c49a3',   // muted violet icon
    glowShadow:  '0 20px 50px rgba(92, 73, 163, 0.15)',
    borderHover: '#e4dcfa',
  },
];

export default function GetStartedPage() {
  const navigate = useNavigate();

  const handleMoodSelect = (moodLabel) => {
    navigate(`/auth?mode=signup&mood=${encodeURIComponent(moodLabel)}`);
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
        backgroundColor: '#f9f9f9',
        position: 'relative',
        overflow: 'hidden',
        px: 3,
        pt: '80px',   /* AppBar offset */
        pb: '96px',
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
          opacity: 0.03,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'linear-gradient(to top right, #00450d, #795900)',
            filter: 'blur(120px)',
          }}
        />
      </Box>

      {/* ── Floating accent blobs ──────────────────────────── */}
      <Box
        sx={{
          position: 'fixed',
          top: '15%',
          right: '5%',
          width: 128,
          height: 128,
          borderRadius: '50%',
          background: 'rgba(255, 223, 160, 0.1)',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          left: '10%',
          width: 192,
          height: 192,
          borderRadius: '50%',
          background: 'rgba(172, 244, 164, 0.1)',
          filter: 'blur(24px)',
          pointerEvents: 'none',
        }}
      />

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
              fontWeight: 800,
              fontSize: { xs: '3.5rem', md: '5rem' },
              color: '#1a1c1c',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              mb: { xs: 3, md: 4 },
            }}
          >
            How are we feeling today?
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Inter", sans-serif',
              color: '#41493e',
              fontSize: { xs: '1rem', md: '1.25rem' },
              maxWidth: 560,
              mx: 'auto',
              opacity: 0.8,
              lineHeight: 1.6,
            }}
          >
            A moment of reflection to anchor your journey. Choose the state that resonates most with your present self.
          </Typography>
        </Box>

        {/* Mood Buttons — each with its own emotional color */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
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
                px: 5,
                py: 4,
                borderRadius: '8px',
                minWidth: 240,
                width: { xs: '100%', md: 'auto' },
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                outline: 'none',
                '&:hover': {
                  backgroundColor: mood.bgHover,
                  transform: 'scale(1.02)',
                  boxShadow: mood.glowShadow,
                },
                '&:active': {
                  transform: 'scale(0.95)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '8px',
                  border: '2px solid transparent',
                  transition: 'border-color 0.3s ease',
                  pointerEvents: 'none',
                },
                '&:hover::after': {
                  borderColor: mood.borderHover,
                },
              }}
            >
              <Box sx={{ mb: 2, color: mood.iconColor }}>
                {mood.icon}
              </Box>
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 700,
                  fontSize: '1.125rem',
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
