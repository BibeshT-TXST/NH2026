/**
 * App Shell — The Curated Canvas
 *
 * Renders the TopBar and routes pages.
 * Paper texture overlay floats above everything for
 * premium editorial grain.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <>
      {/* Glassmorphism AppBar */}
      <TopBar />

      {/* Page content */}
      <Box component="div" sx={{ pt: '80px' /* offset for fixed AppBar */ }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Box>

      {/* Paper texture overlay — atmospheric grain */}
      <div className="paper-texture" />
    </>
  );
}
