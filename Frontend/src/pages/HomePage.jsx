/**
 * HomePage — The Curated Canvas landing
 *
 * Full-viewport hero section with editorial typography,
 * atmospheric glow blobs, and a gradient CTA.
 * No nav links. No account icon. Gallery-like soul.
 */
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default', // pure white
        position: 'relative',
        overflow: 'hidden',
        px: 3,
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
          background: 'rgba(248, 189, 42, 0.08)',
        }}
      />
      <Box
        className="glow-blob"
        sx={{
          width: 400,
          height: 400,
          bottom: -96,
          right: -96,
          background: 'rgba(0, 69, 13, 0.04)',
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
          }}
        >
          Lets Build Us
        </Typography>

        {/* CTA — Velvet gradient */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              px: { xs: 5, md: 6 },
              py: { xs: 1.8, md: 2.2 },
              fontSize: { xs: '1rem', md: '1.125rem' },
              borderRadius: '6px',
              position: 'relative',
              overflow: 'hidden',
              /* Shimmer overlay on hover */
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'rgba(255,255,255,0.1)',
                opacity: 0,
                transition: 'opacity 0.25s ease',
              },
              '&:hover::after': {
                opacity: 1,
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
