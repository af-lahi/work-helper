import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Alert,
  IconButton,
  useTheme,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';

const JwtDebugger = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [jwt, setJwt] = useState('');
  const [error, setError] = useState('');
  const [header, setHeader] = useState(null);
  const [payload, setPayload] = useState(null);

  const handleJwtChange = (e) => {
    const value = e.target.value;
    setJwt(value);
    setError('');
    setHeader(null);
    setPayload(null);

    if (!value) return;

    try {
      const parts = value.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const headerPart = JSON.parse(atob(parts[0]));
      const payloadPart = JSON.parse(atob(parts[1]));

      setHeader(headerPart);
      setPayload(payloadPart);
    } catch (e) {
      setError('Invalid JWT format');
    }
  };

  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">JWT Debugger</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          JSON Web Token (JWT)
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={jwt}
            onChange={handleJwtChange}
            placeholder="Paste your JWT here"
            variant="outlined"
          />
          {jwt && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <IconButton 
                onClick={() => copyToClipboard(jwt)}
                size="small"
                sx={{ bgcolor: theme.palette.action.hover }}
              >
                <ContentCopyIcon />
              </IconButton>
              <IconButton 
                onClick={() => setJwt('')}
                size="small"
                sx={{ bgcolor: theme.palette.action.hover }}
              >
                <Typography variant="button">Clear</Typography>
              </IconButton>
            </Box>
          )}
        </Box>
      </Paper>

      {header && payload && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Header
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2,
                    position: 'relative',
                    '&:hover .copy-button': {
                      opacity: 1
                    }
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                    {formatJson(header)}
                  </pre>
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(formatJson(header))}
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                    className="copy-button"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Payload
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2,
                    position: 'relative',
                    '&:hover .copy-button': {
                      opacity: 1
                    }
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                    {formatJson(payload)}
                  </pre>
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(formatJson(payload))}
                    sx={{ 
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                    className="copy-button"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default JwtDebugger; 