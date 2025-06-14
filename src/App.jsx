import { useState, useMemo, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Box,
  Container,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JsonDiffTool from './components/JsonDiffTool';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import SqlDiffTool from './components/SqlDiffTool';
import UnixTimeConverter from './components/UnixTimeConverter';
import JwtDebugger from './components/JwtDebugger';
import SqlDiffView from './components/SqlDiffView';
import JsonDiffView from './components/JsonDiffView';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');
  const [isThemeReady, setIsThemeReady] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#1976d2',
                },
                secondary: {
                  main: '#dc004e',
                },
                background: {
                  default: '#f5f5f5',
                  paper: '#ffffff',
                },
              }
            : {
                primary: {
                  main: '#90caf9',
                },
                secondary: {
                  main: '#f48fb1',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(','),
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    setIsThemeReady(true);
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  if (!isThemeReady) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: mode === 'dark' ? '#121212' : '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar mode={mode} toggleTheme={toggleTheme} />
          <Container component="main" sx={{ flex: 1, py: 4 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/json-diff" element={<JsonDiffTool />} />
              <Route path="/sql-diff" element={<SqlDiffTool />} />
              <Route path="/sql-diff-view" element={<SqlDiffView />} />
              <Route path="/json-diff-view" element={<JsonDiffView />} />
              <Route path="/unix-converter" element={<UnixTimeConverter />} />
              <Route path="/jwt-debugger" element={<JwtDebugger />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
