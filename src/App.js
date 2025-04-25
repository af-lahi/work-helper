import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TimestampConverter from './components/TimestampConverter';
import RegexTester from './components/RegexTester';
import CronTester from './components/CronTester';
import JsonSchemaGenerator from './components/JsonSchemaGenerator';
import JsonDiffViewer from './components/JsonDiffViewer';
import JwtDecoder from './components/JwtDecoder';
import SqlDiffViewer from './components/SqlDiffViewer';

function App() {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#6366f1', // Indigo
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#8b5cf6', // Purple
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      background: {
        default: '#0f172a', // Slate 900
        paper: '#1e293b', // Slate 800
      },
      error: {
        main: '#ef4444', // Red
      },
      warning: {
        main: '#f59e0b', // Amber
      },
      success: {
        main: '#10b981', // Emerald
      },
      info: {
        main: '#3b82f6', // Blue
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 600 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e293b', // Slate 800
            backgroundImage: 'none',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app" style={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: theme.palette.background.default 
        }}>
          <Navbar />
          <main style={{ 
            flex: 1,
            padding: '1rem',
            width: '100%',
            maxWidth: '1920px',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/timestamp" element={<TimestampConverter />} />
              <Route path="/regex" element={<RegexTester />} />
              <Route path="/cron" element={<CronTester />} />
              <Route path="/json-schema" element={<JsonSchemaGenerator />} />
              <Route path="/json-diff" element={<JsonDiffViewer />} />
              <Route path="/jwt" element={<JwtDecoder />} />
              <Route path="/sql-diff" element={<SqlDiffViewer />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
