/**
 * TopBar.jsx — Global Navigation Interface
 *
 * A minimalist, transparent header that provides brand identity 
 * across the application. Designed to be unobtrusive, it uses 
 * subtle typography and spacing to maintain the "Current Canvas" 
 * editorial aesthetic.
 */

import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

// ── Root Component ──────────────────────────────────────────────────────────

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
        {/* ── Brand Wordmark ────────────────────────────────────────── */}
        
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
          {/* Brand name can be placed here if needed */}
        </Typography>

        {/* ── Layout Utilities ──────────────────────────────────────── */}
        
        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}

