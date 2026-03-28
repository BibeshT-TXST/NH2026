/**
 * App Shell — The Curated Canvas
 *
 * Renders the TopBar and routes pages.
 * The /reflect route is a focused, immersive experience — TopBar is hidden.
 * Paper texture overlay floats above everything for premium editorial grain.
 */
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import GetStartedPage from './pages/GetStartedPage';
import AuthPage from './pages/AuthPage';
import ReflectionPage from './pages/ReflectionPage';
import assets from './components/longform/assets';

// Routes where the TopBar + its padding offset should be hidden
const NO_NAV_ROUTES = ['/reflect'];

export default function App() {
  const location = useLocation();
  const hideNav = NO_NAV_ROUTES.includes(location.pathname);

  return (
    <>
      {/* Glassmorphism AppBar — hidden on focused pages */}
      {!hideNav && <TopBar />}

      {/* Page content */}
      <Box component="div" sx={{ pt: hideNav ? 0 : '80px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reflect" element={<ReflectionPage />} />
          <Route path="card" element={<assets />} />
        </Routes>
      </Box>

      {/* Paper texture overlay — atmospheric grain */}
      <div className="paper-texture" />
    </>
  );
}
