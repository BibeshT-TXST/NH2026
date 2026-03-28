/**
 * The Curated Canvas — MUI Theme
 *
 * A high-end editorial design system built on intentional atmospheric depth,
 * extreme whitespace, and the tension between heavy typography and
 * near-white surfaces. No borders. No flat shadows. Only tonal layering.
 */
import { createTheme } from '@mui/material/styles';

/* ── Color Tokens ─────────────────────────────────────────── */
const palette = {
  primary:                  '#00450d',
  primaryContainer:         '#1b5e20',
  onPrimary:                '#ffffff',
  onPrimaryContainer:       '#90d689',
  primaryFixed:             '#acf4a4',
  primaryFixedDim:          '#91d78a',

  secondary:                '#795900',
  secondaryContainer:       '#fec330',
  onSecondary:              '#ffffff',
  onSecondaryContainer:     '#6f5100',
  secondaryFixed:           '#ffdfa0',
  secondaryFixedDim:        '#f8bd2a',

  tertiary:                 '#6b1d3d',
  tertiaryContainer:        '#883454',
  onTertiary:               '#ffffff',

  error:                    '#ba1a1a',
  errorContainer:           '#ffdad6',
  onError:                  '#ffffff',
  onErrorContainer:         '#93000a',

  background:               '#f9f9f9',
  onBackground:             '#1a1c1c',
  surface:                  '#f9f9f9',
  surfaceBright:            '#f9f9f9',
  surfaceDim:               '#dadada',
  surfaceContainerLowest:   '#ffffff',
  surfaceContainerLow:      '#f3f3f3',
  surfaceContainer:         '#eeeeee',
  surfaceContainerHigh:     '#e8e8e8',
  surfaceContainerHighest:  '#e2e2e2',
  surfaceVariant:           '#e2e2e2',
  onSurface:                '#1a1c1c',
  onSurfaceVariant:         '#41493e',
  outline:                  '#717a6d',
  outlineVariant:           '#c0c9bb',

  inverseSurface:           '#2f3131',
  inverseOnSurface:         '#f1f1f1',
  inversePrimary:           '#91d78a',
  surfaceTint:              '#2a6b2c',
};

/* ── MUI Theme ────────────────────────────────────────────── */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main:         palette.primary,
      light:        palette.primaryFixedDim,
      dark:         palette.primaryContainer,
      contrastText: palette.onPrimary,
    },
    secondary: {
      main:         palette.secondary,
      light:        palette.secondaryFixedDim,
      dark:         palette.secondaryContainer,
      contrastText: palette.onSecondary,
    },
    error: {
      main:         palette.error,
      light:        palette.errorContainer,
      contrastText: palette.onError,
    },
    background: {
      default: palette.surfaceContainerLowest,   // pure white base
      paper:   palette.surface,                   // off-white paper
    },
    text: {
      primary:   palette.onBackground,            // #1a1c1c — never pure black
      secondary: palette.onSurfaceVariant,         // #41493e
      disabled:  palette.outline,
    },
    divider: 'transparent',                        // "No-Line" rule
  },

  typography: {
    fontFamily: '"Inter", sans-serif',
    /* Display — editorial anchor */
    h1: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: palette.onBackground,
      '@media (min-width:900px)': { fontSize: '7rem' },
    },
    /* Headline */
    h2: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      color: palette.onBackground,
      '@media (min-width:900px)': { fontSize: '2.5rem' },
    },
    h3: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      color: palette.onBackground,
    },
    h4: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      color: palette.onBackground,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: palette.onSurfaceVariant,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: palette.onSurfaceVariant,
    },
    button: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '0.75rem',
      color: palette.outline,
    },
  },

  shape: { borderRadius: 4 },   // 0.25rem — sharp, architectural

  shadows: [
    'none',
    /* Ambient shadow for floating elements (level 1–4) */
    ...Array(4).fill(`0 4px 40px rgba(26, 28, 28, 0.04)`),
    ...Array(20).fill(`0 8px 60px rgba(26, 28, 28, 0.06)`),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.surfaceContainerLowest,
          color: palette.onBackground,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: palette.secondaryFixed,
          color: palette.onBackground,
        },
      },
    },
    /* Buttons */
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '12px 32px',
          fontSize: '1rem',
          transition: 'all 0.2s ease',
          '&:active': { transform: 'scale(0.97)' },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${palette.primary} 0%, ${palette.primaryContainer} 100%)`,
          color: palette.onPrimary,
          '&:hover': {
            background: `linear-gradient(135deg, ${palette.primaryContainer} 0%, ${palette.primary} 100%)`,
          },
        },
        containedSecondary: {
          background: palette.secondaryContainer,
          color: palette.onSurface,
          '&:hover': {
            background: palette.secondaryFixedDim,
          },
        },
        text: {
          color: palette.primary,
          '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' },
        },
      },
    },
    /* Cards — No-Line Rule: no borders */
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: 'none',
          backgroundColor: palette.surfaceContainerLowest,
          transition: 'background-color 0.25s ease',
          '&:hover': {
            backgroundColor: palette.surfaceContainerLow,
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: 'none' },
      },
    },
    /* Inputs — "Forgo the box" */
    MuiTextField: {
      defaultProps: { variant: 'filled' },
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: palette.surfaceContainerLow,
            borderRadius: 4,
            border: 'none',
            '&:before, &:after': { display: 'none' },
            '&:hover': { backgroundColor: palette.surfaceContainerHigh },
            '&.Mui-focused': { backgroundColor: palette.surfaceContainerHighest },
          },
        },
      },
    },
    /* Chip — Selection Chips */
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
        },
        filled: {
          backgroundColor: palette.secondaryFixedDim,
          color: palette.onSurface,
          '&.Mui-selected, &[aria-selected="true"]': {
            backgroundColor: palette.secondaryContainer,
          },
        },
      },
    },
    /* AppBar — Glass nav */
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(249, 249, 249, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: palette.onBackground,
        },
      },
    },
    /* Divider — hidden by default */
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'transparent' },
      },
    },
  },
});

export default theme;
export { palette };
