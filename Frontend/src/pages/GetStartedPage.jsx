/**
 * GetStartedPage.jsx — Mood Discovery
 *
 * The central mood-selection experience of "Lets Build Us."
 * Features high-impact interactive mood cards that set the global 
 * atmospheric tone (video, audio, colors) for the rest of the application.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Stack } from '@mui/material';

// Icons
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

// Context
import { useBackground } from '../context/BackgroundContext';

// ── Configuration: Mood Taxonomy ───────────────────────────────────────────

/**
 * Mood configuration defines the visual and emotional aesthetics 
 * for the interactive selection cards.
 */
const moods = [
  {
    icon: <SentimentVerySatisfiedIcon sx={{ fontSize: 40 }} />,
    label: 'Its going great',
    bg: '#a8e6a1',   
    bgHover: '#8cd684',   
    textColor: '#1b5e20',   
    iconColor: '#2e7d32',   
    glowShadow: '0 20px 50px rgba(46, 125, 50, 0.18)',
    borderHover: '#c8f7c5',
  },
  {
    icon: <SentimentSatisfiedIcon sx={{ fontSize: 40 }} />,
    label: 'Its Going good',
    bg: '#fec330',   
    bgHover: '#f5b800',
    textColor: '#6f5100',
    iconColor: '#8d6e00',
    glowShadow: '0 20px 50px rgba(254, 195, 48, 0.2)',
    borderHover: '#ffdfa0',
  },
  {
    icon: <SentimentNeutralIcon sx={{ fontSize: 40 }} />,
    label: 'Its going ok',
    bg: '#d4c8f5',   
    bgHover: '#c4b5ed',
    textColor: '#3a2d6b',   
    iconColor: '#5c49a3',   
    glowShadow: '0 20px 50px rgba(92, 73, 163, 0.15)',
    borderHover: '#e4dcfa',
  },
];

// ── Root Component ──────────────────────────────────────────────────────────

export default function GetStartedPage() {
  const navigate = useNavigate();
  const { setMood } = useBackground();

  /**
   * handleMoodSelect
   * Maps the human-readable label to the internal mood state.
   *
   * @param {string} moodLabel - The label from the selected mood card.
   */
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
      {/* ── Visual Backdrop: Radial Atmosphere ──────────────────── */}
      
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

      {/* ── Main Layout Area ────────────────────────────────────── */}
      
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Hero Section */}
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
            A moment of reflection to anchor your journey. Choose the state that 
            resonates most with your present self.
          </Typography>
        </Box>

        {/* Dynamic Mood Selection Grid */}
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

