import { createTheme } from '@mui/material/styles';

// Tesseract Design Theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#B85C4E',
            light: '#D87B6E',
            dark: '#A04D40',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#6B6B6B',
            light: '#9E9E9E',
            dark: '#4A4A4A',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#4CAF50',
            light: '#81C784',
            dark: '#388E3C',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#FF9800',
            light: '#FFB74D',
            dark: '#F57C00',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#F44336',
            light: '#E57373',
            dark: '#D32F2F',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#F5F2EE',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#6B6B6B',
            disabled: '#9E9E9E',
        },
        divider: '#EEEBE7',
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    shadows: [
        'none',
        '0 1px 3px rgba(0, 0, 0, 0.08)',
        '0 2px 4px rgba(0, 0, 0, 0.08)',
        '0 4px 6px rgba(0, 0, 0, 0.1)',
        '0 8px 16px rgba(0, 0, 0, 0.12)',
        '0 12px 24px rgba(0, 0, 0, 0.14)',
        '0 16px 32px rgba(0, 0, 0, 0.16)',
        '0 20px 40px rgba(0, 0, 0, 0.18)',
        '0 24px 48px rgba(0, 0, 0, 0.2)',
        ...Array(15).fill('0 24px 48px rgba(0, 0, 0, 0.2)'),
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
                    },
                },
                outlined: {
                    borderWidth: '1.5px',
                    '&:hover': {
                        borderWidth: '1.5px',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                    },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                },
            },
        },
    },
});

export default theme;
