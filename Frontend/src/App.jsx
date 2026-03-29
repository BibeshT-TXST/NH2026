import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import GetStartedPage from './pages/GetStartedPage';
import ReflectionPage from './pages/ReflectionPage';

import DashboardPage from './pages/DashboardPage';

// Background system
import { BackgroundProvider } from './context/BackgroundContext';
import BackgroundLayer from './components/BackgroundLayer';

// Routes where the TopBar + its padding offset should be hidden
const NO_NAV_ROUTES = ['/reflect', '/dashboard'];

export default function App() {
  const location = useLocation();
  const hideNav = NO_NAV_ROUTES.includes(location.pathname);

  return (
    <BackgroundProvider>
      {/* Background Video/Audio Layer — fixed behind all content */}
      <BackgroundLayer />

      {/* Glassmorphism AppBar — hidden on focused pages */}
      {!hideNav && <TopBar />}

      {/* Page content — zIndex ensured so it stays above background */}
      <Box component="div" sx={{ pt: hideNav ? 0 : '80px', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/reflect" element={<ReflectionPage />} />

          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Box>

      {/* Paper texture overlay — atmospheric grain — floats above everything */}
      <div className="paper-texture" />
    </BackgroundProvider>
  );
}
