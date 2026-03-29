/**
 * DashboardPage.jsx — Personal Wellness Hub
 *
 * This is the dynamic dashboard that surfaces personalized therapeutic 
 * interventions and campus events based on the user's recent reflection.
 * Uses a bento-style adaptive grid to present both acute micro-therapies 
 * and long-term community connections.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Icons
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Shortform Components
import BoxBreathingCard from '../components/shortform/BoxBreathingCard';
import CognitiveDefusionCard from '../components/shortform/CognitiveDefusionCard';
import GroundingCarouselCard from '../components/shortform/GroundingCarouselCard';
import FractalFlowCard from '../components/shortform/FractalFlowCard';
import PMRCard from '../components/shortform/PMRCard';

// Longform Components
import EventCard from '../components/longform/EventCard';
import { events } from '../components/longform/CampusEventsGrid';


// ── Design Tokens ──────────────────────────────────────────────────────────

const accent = 'var(--accent)';
const ink    = 'var(--text-primary)';
const muted  = 'var(--text-secondary)';
const white  = 'var(--card-surface)';

/**
 * Shared Bento Card Base Style
 */
const card = (extra = {}) => ({
  backgroundColor: white,
  borderRadius: '14px',
  border: '1px solid rgba(192,201,187,0.2)',
  overflow: 'hidden',
  ...extra,
});


/**
 * Determines the time-appropriate greeting for the dashboard header.
 */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}


/**
 * Placeholder roadmap sections for future version releases.
 */
const SECTIONS = [
  { icon: '📓', label: 'Reflections',  description: 'Your daily journal entries will appear here.' },
  { icon: '📈', label: 'Growth',       description: 'Track your emotional patterns over time.' },
  { icon: '🎯', label: 'Intentions',   description: 'Set and revisit your personal goals.' },
  { icon: '🌱', label: 'Identity',     description: 'Explore and build who you are becoming.' },
];


export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [mounted, setMounted]   = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  // AI Analysis Results (passed via Router state)
  const classification       = location.state?.classification;
  const recommendedComponent = classification?.component;
  const longformNames        = classification?.longformComponents || [];
  const reasoning           = classification?.reasoning;
  const messageToUser        = classification?.messageToUser || reasoning;

  /**
   * Resolve longform names to full event objects.
   */
  const recommendedEvents = longformNames
    .map(name => events.find(e => e.title === name))
    .filter(Boolean);

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // ── Lifecycle & Effects ──────────────────────────────────────────────────

  /**
   * Entry animation trigger
   */
  useEffect(() => { 
    const timer = setTimeout(() => setMounted(true), 60); 
    return () => clearTimeout(timer);
  }, []);

  /**
   * Clock synchronization for the greeting text.
   */
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => clearInterval(id);
  }, []);

  // ── Render Template ──────────────────────────────────────────────────────


  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        px: { xs: 2, md: '3vw' },
        pt: '100px',
        pb: '5vh',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{
        maxWidth: 1200,
        width: '100%',
        mx: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2vh',
      }}>

        {/* ── SECTION: Header & Actions ────────────────────────────── */}
        
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          px: '2px',
        }}>
          <Typography sx={{
            fontFamily: '"Manrope", sans-serif',
            fontWeight: 850,
            fontSize: '1.25rem',
            color: ink,
            letterSpacing: '-0.02em',
            cursor: 'default',
          }}>
            Lets Build Us
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: muted,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>
              {todayStr}
            </Typography>

            {/* Exit CTA */}
            <Box
              component="button"
              onClick={() => navigate('/')}
              sx={{
                backgroundColor: white,
                color: ink,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                px: '24px',
                py: '10px',
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 800,
                fontSize: '0.9rem',
                letterSpacing: '0.01em',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: accent,
                  color: '#ffffff',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                },
                '&:active': { transform: 'scale(0.97)' },
              }}
            >
              Exit
            </Box>
          </Box>
        </Box>

        {/* ── SECTION: Adaptive Bento Grid ─────────────────────────── */}
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1.2fr' },
          gap: '20px',
        }}>

          {/* 🔗 LEFT COLUMN: Primary Intervention */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
          }}>

            {!recommendedComponent ? (
              /* Default State: Overview Card */
              <Box sx={{
                ...card({
                  p: '48px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: accent,
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }),
                border: 'none',
              }}>
                {/* Decorative Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }} />
                
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)',
                    mb: 1.5,
                  }}>
                    Your space
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 850,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    color: '#ffffff',
                    mb: 3,
                  }}>
                    {greeting}.<br />
                    Ready to build?
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    lineHeight: 1.6,
                    color: 'rgba(255, 255, 255, 0.85)',
                    maxWidth: 500,
                  }}>
                    This is your personal canvas. More features are coming — your reflections 
                    and growth will live here.
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 3 }}>
                  <Box sx={{ 
                    width: 8, height: 8, borderRadius: '50%', 
                    backgroundColor: '#acf4a4', animation: 'pulse 2s infinite' 
                  }} />
                  <Typography sx={{ fontFamily: '"Inter", sans-serif', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                    v1.0 · Active
                  </Typography>
                </Box>
              </Box>
            ) : (
              /* Analysis State: Personalized Component */
              <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                py: 4,
              }}>
                <Box sx={{ textAlign: 'center', mb: 4, maxWidth: 500 }}>
                  <Box sx={{ 
                    display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1.5,
                    backgroundColor: 'rgba(0,0,0,0.05)', px: 2, py: 0.5, borderRadius: 'full' 
                  }}>
                     <AutoAwesomeIcon sx={{ fontSize: 14, color: accent }} />
                     <Typography sx={{ 
                       fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', 
                       fontWeight: 850, color: accent, textTransform: 'uppercase', 
                       letterSpacing: '0.1em' 
                     }}>
                       Recommended for you
                     </Typography>
                  </Box>
                  <Typography sx={{ 
                    fontFamily: '"Inter", sans-serif', fontSize: '1.1rem', 
                    fontWeight: 800, color: ink, fontStyle: 'italic', lineHeight: 1.6 
                  }}>
                    "{messageToUser}"
                  </Typography>
                </Box>
                
                {recommendedComponent === 'BoxBreathingCard' && <BoxBreathingCard />}
                {recommendedComponent === 'CognitiveDefusionCard' && <CognitiveDefusionCard />}
                {recommendedComponent === 'GroundingCarouselCard' && <GroundingCarouselCard />}
                {recommendedComponent === 'FractalFlowCard' && <FractalFlowCard />}
                {recommendedComponent === 'PMRCard' && <PMRCard />}
              </Box>
            )}
          </Box>

          {/* 🔗 RIGHT COLUMN: Community & Context */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            gap: '10px',
            minHeight: 0,
            overflowY: 'auto'
          }}>

            {recommendedComponent && recommendedEvents.length > 0 ? (
              /* Results Mode: Suggested Activities */
              <>
                <Typography sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 850,
                  color: ink,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  px: 1,
                  mt: 0.5,
                  mb: 0.5,
                }}>
                  Suggested Activities
                </Typography>

                {recommendedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </>
            ) : (
              /* Idle Mode: Roadmap Sections */
              SECTIONS.map((section) => (
                <Box
                  key={section.label}
                  sx={{
                    ...card({
                      p: '18px 20px',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 0,
                      cursor: 'default',
                      transition: 'border-color 0.2s ease',
                    }),
                    '&:hover': { borderColor: 'rgba(0,69,13,0.15)' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1, mt: '1px' }}>
                      {section.icon}
                    </Typography>
                    <Box>
                      <Typography sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: ink,
                        mb: 0.5,
                      }}>
                        {section.label}
                      </Typography>
                      <Typography sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.73rem',
                        color: muted,
                        lineHeight: 1.55,
                        opacity: 0.75,
                      }}>
                        {section.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{
                    mt: 1.5,
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    px: '9px',
                    py: '3px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,69,13,0.06)',
                  }}>
                    <Typography sx={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: 'rgba(0,69,13,0.5)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      Coming soon
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
