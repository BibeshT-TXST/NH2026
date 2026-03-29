/**
 * HomePage — The Curated Canvas landing
 *
 * Full-viewport hero section with editorial typography,
 * atmospheric glow blobs, and a gradient CTA.
 * No nav links. No account icon. Gallery-like soul.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';

export default function HomePage() {
  const navigate = useNavigate();

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
        py: 8, // added padding for scrolling
      }}
    >
      {/* ── Atmospheric glow blobs ─────────────────────────── */}
      <Box
        className="glow-blob"
        sx={{
          width: 320,
          height: 320,
          top: -96,
          left: -96,
          background: 'var(--accent)',
          opacity: 0.05,
        }}
      />
      <Box
        className="glow-blob"
        sx={{
          width: 400,
          height: 400,
          bottom: -96,
          right: -96,
          background: 'var(--accent)',
          opacity: 0.03,
        }}
      />

      {/* ── Hero content ───────────────────────────────────── */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* H1 — Editorial anchor with generous breathing room */}
        <Typography
          variant="h1"
          sx={{
            mb: { xs: 5, md: 7 },
            mt: 4,
            fontSize: { xs: '5.5rem', md: '7rem' },
            fontWeight: 850,
            color: 'var(--text-primary)',
            letterSpacing: '-0.04em',
            transition: 'color 0.5s ease',
          }}
        >
          Lets Build Us
        </Typography>



        {/* CTA — Velvet gradient → navigates to /get-started */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/get-started')}
            sx={{
              px: { xs: 6, md: 8 },
              py: { xs: 2.2, md: 2.8 },
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 800,
              borderRadius: '12px',
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              textTransform: 'lowercase',
              '&:hover': {
                backgroundColor: 'var(--accent)',
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
                filter: 'brightness(1.1)',
              },
            }}
          >
            lets get started
          </Button>
        </Box>
      </Container>
    </Box>

  );
}
