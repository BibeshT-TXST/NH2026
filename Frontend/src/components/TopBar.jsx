/**
 * TopBar — Glassmorphism AppBar
 *
 * Floating navigation with backdrop-blur.
 * Only shows the brand wordmark — no nav links, no account icon
 * (per spec: "remove those headers and the account icon").
 */
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function TopBar() {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        boxShadow: 'none',
        borderBottom: 'none',
      }}
    >

      <Toolbar
        sx={{
          maxWidth: '80rem',
          width: '100%',
          mx: 'auto',
          px: { xs: 3, md: 4 },
          height: 80,
        }}
      >
        {/* Brand wordmark */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 850,
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            userSelect: 'none',
            transition: 'color 0.5s ease',
          }}
        >

        </Typography>




        {/* Spacer — pushes nothing; keeps layout tidy */}
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}
