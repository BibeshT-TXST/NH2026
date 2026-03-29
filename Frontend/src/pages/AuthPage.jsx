/**
 * AuthPage — Login / Sign Up
 *
 * Clean, warm auth experience for a mental-health app.
 * Split layout: editorial brand panel (left) + form (right).
 * Toggle between Login and Sign Up inline.
 * No nav clutter. Only the "Lets Build Us" wordmark in the TopBar.
 */
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Stack,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

/* ── Identity chips for sign-up ───────────────────────────── */
const identityOptions = ['Student', 'Professional', 'Its just me'];

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup';

  const [mode, setMode] = useState(initialMode);
  const [identity, setIdentity] = useState('Student');
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      if (email === 'test@gmail.com' && password === '123456') {
        navigate('/reflect');
      } else {
        setErrorMsg('Invalid email or password. Try test@gmail.com / 123456.');
      }
    } else {
      // Demo signup: just proceed
      if (!email || !password) {
        setErrorMsg('Please fill out all fields.');
        return;
      }
      navigate('/reflect');
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',

        pt: '80px',
        pb: 6,
        px: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1040,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          backgroundColor: 'var(--card-surface)',
          backdropFilter: 'blur(16px) saturate(120%)',
          borderRadius: '24px',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.12)',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >

        {/* ═══════════════════════════════════════════════════════
            LEFT — Brand / Atmospheric panel (desktop only)
        ═══════════════════════════════════════════════════════ */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--accent)',
            p: 6,
            position: 'relative',
          }}
        >

          {/* Decorative blur */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -80,
              right: -80,
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              filter: 'blur(48px)',
              pointerEvents: 'none',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 850,
                fontSize: '2.75rem',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 3,
              }}
            >

              Your mind
              <br />
              deserves a
              <br />
              safe space.
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.6,
                maxWidth: 300,
              }}
            >
              A curated space to check in with yourself, grow with intention, and build the life you want.
            </Typography>


          </Box>

          {/* Bottom accent */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '8px',
              backgroundColor: 'rgba(27, 94, 32, 0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#fec330',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
              }}
            >
              ✦
            </Box>
            <Typography
              sx={{
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Join a growing community of self-builders.
            </Typography>

          </Box>
        </Box>

        {/* ═══════════════════════════════════════════════════════
            RIGHT — Form panel
        ═══════════════════════════════════════════════════════ */}
        <Box
          sx={{
            p: { xs: 4, md: 8 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ maxWidth: 420, mx: 'auto', width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 6 }}>
              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 850,
                  fontSize: '2.25rem',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  mb: 1.5,
                }}
              >
                {isLogin ? 'Welcome back' : 'Create account'}
              </Typography>

              <Typography
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.9rem',
                  color: '#41493e',
                }}
              >
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <Box
                      component="span"
                      onClick={() => setMode('signup')}
                      sx={{
                        color: '#00450d',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Sign up
                    </Box>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Box
                      component="span"
                      onClick={() => setMode('login')}
                      sx={{
                        color: '#00450d',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Log in
                    </Box>
                  </>
                )}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                {errorMsg && (
                  <Box
                    sx={{
                      backgroundColor: 'rgba(186, 26, 26, 0.1)',
                      color: '#ba1a1a',
                      px: 3,
                      py: 2,
                      borderRadius: '8px',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    {errorMsg}
                  </Box>
                )}
                {/* ── Identity chips (sign-up only) ──────────── */}
                {!isLogin && (
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'rgba(65, 73, 62, 0.6)',
                        mb: 1.5,
                      }}
                    >
                      I am a...
                    </Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                      {identityOptions.map((opt) => (
                        <Chip
                          key={opt}
                          label={opt}
                          clickable
                          onClick={() => setIdentity(opt)}
                          sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: identity === opt ? 600 : 500,
                            fontSize: '0.8rem',
                            borderRadius: '9999px',
                            backgroundColor:
                              identity === opt ? '#fec330' : '#f3f3f3',
                            color:
                              identity === opt ? '#6f5100' : '#41493e',
                            border: 'none',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor:
                                identity === opt ? '#f8bd2a' : '#e8e8e8',
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {/* ── Email field ─────────────────────────────── */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="auth-email"
                    sx={{
                      display: 'block',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#41493e',
                      mb: 1,
                    }}
                  >
                    Email Address
                  </Typography>
                  <Box
                    component="input"
                    id="auth-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{
                      width: '100%',
                      height: 56,
                      px: 2,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.95rem',
                      color: '#1a1c1c',
                      backgroundColor: '#f3f3f3',
                      border: 'none',
                      borderRadius: '4px',
                      outline: 'none',
                      transition: 'background-color 0.2s ease',
                      '&:focus': {
                        backgroundColor: '#e2e2e2',
                      },
                      '&::placeholder': {
                        color: 'rgba(65, 73, 62, 0.4)',
                      },
                    }}
                  />
                </Box>

                {/* ── Password field ──────────────────────────── */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography
                      component="label"
                      htmlFor="auth-password"
                      sx={{
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#41493e',
                      }}
                    >
                      Password
                    </Typography>
                    {isLogin && (
                      <Typography
                        component="a"
                        href="#"
                        sx={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          color: '#00450d',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        Forgot password?
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="input"
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      sx={{
                        width: '100%',
                        height: 56,
                        px: 2,
                        pr: 6,
                        fontFamily: '"Inter", sans-serif',
                        fontSize: '0.95rem',
                        color: '#1a1c1c',
                        backgroundColor: '#f3f3f3',
                        border: 'none',
                        borderRadius: '4px',
                        outline: 'none',
                        transition: 'background-color 0.2s ease',
                        '&:focus': {
                          backgroundColor: '#e2e2e2',
                        },
                        '&::placeholder': {
                          color: 'rgba(65, 73, 62, 0.4)',
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'rgba(65, 73, 62, 0.5)',
                        '&:hover': { color: '#00450d' },
                      }}
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </Box>

                {/* ── Submit button ───────────────────────────── */}
                  <Box
                    component="button"
                    type="submit"
                    sx={{
                      width: '100%',
                      height: 64,
                      backgroundColor: 'var(--accent)',
                      color: '#ffffff',
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      '&:hover': {
                        filter: 'brightness(1.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                      },
                      '&:active': {
                        transform: 'scale(0.97)',
                      },
                    }}
                  >
                    {isLogin ? 'Login' : 'Create account'}
                  </Box>

              </Stack>
            </Box>



            {/* ── Terms footer (sign-up only) ─────────────────── */}
            {!isLogin && (
              <Box
                sx={{
                  mt: 5,
                  pt: 4,
                  borderTop: '1px solid rgba(192, 201, 187, 0.12)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.68rem',
                    lineHeight: 1.6,
                    color: 'rgba(65, 73, 62, 0.5)',
                    textAlign: 'center',
                  }}
                >
                  By clicking "Create account", you agree to our{' '}
                  <Box
                    component="a"
                    href="#"
                    sx={{
                      color: 'rgba(65, 73, 62, 0.5)',
                      textDecoration: 'underline',
                      '&:hover': { color: '#00450d' },
                    }}
                  >
                    Terms of Service
                  </Box>{' '}
                  and{' '}
                  <Box
                    component="a"
                    href="#"
                    sx={{
                      color: 'rgba(65, 73, 62, 0.5)',
                      textDecoration: 'underline',
                      '&:hover': { color: '#00450d' },
                    }}
                  >
                    Privacy Policy
                  </Box>
                  .
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
