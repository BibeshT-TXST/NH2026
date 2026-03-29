/**
 * App.jsx — Application Infrastructure
 *
 * This is the root component of the "Lets Build Us" frontend.
 * It orchestrates the global BackgroundProvider, manages top-level 
 * routing via React Router, and overlays atmospheric paper textures.
 */

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import GetStartedPage from './pages/GetStartedPage';
import ReflectionPage from './pages/ReflectionPage';
import DashboardPage from './pages/DashboardPage';

// Components & Context
import TopBar from './components/TopBar';
import { BackgroundProvider } from './context/BackgroundContext';
import BackgroundLayer from './components/BackgroundLayer';

// ── Configuration ──────────────────────────────────────────────────────────

/**
 * Routes where the TopBar should be suppressed to maintain 
 * a focused, immersive experience.
 */
const NO_NAV_ROUTES = ['/reflect', '/dashboard'];

// ── Root Component ─────────────────────────────────────────────────────────

export default function App() {
  const location = useLocation();
  const hideNav  = NO_NAV_ROUTES.includes(location.pathname);

  return (
    <BackgroundProvider>
      {/* 1. Background Media Layer — Fixed behind all content */}
      <BackgroundLayer />

      {/* 2. Navigation Header — Conditionally rendered based on route */}
      {!hideNav && <TopBar />}

      {/* 3. Main Content Area */}
      <Box 
        component="div" 
        sx={{ 
          pt: hideNav ? 0 : '80px', 
          position: 'relative', 
          zIndex: 1 
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/reflect" element={<ReflectionPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Box>

      {/* 4. Atmosphere Layer — Paper texture grain overlay */}
      <div className="paper-texture" />
    </BackgroundProvider>
  );
}

