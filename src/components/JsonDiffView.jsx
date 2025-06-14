import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const JsonDiffView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { leftLines, rightLines, diffLines, leftValue, rightValue } = location.state || { 
    leftLines: [], 
    rightLines: [], 
    diffLines: [],
    leftValue: '',
    rightValue: ''
  };

  // If no data is available, show error and return to editor
  if (!leftLines.length && !rightLines.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back to Editor
        </Button>
        <Typography color="error" variant="h6">
          No diff data available. Please go back and generate a diff first.
        </Typography>
      </Box>
    );
  }

  const handleBack = () => {
    navigate('/json-diff', {
      state: {
        leftValue: leftValue || '',
        rightValue: rightValue || ''
      }
    });
  };

  const renderDiffLine = (line, index, isLeft = true) => {
    const isDiff = diffLines.includes(index);
    const lineStyle = {
      fontFamily: 'monospace',
      whiteSpace: 'pre',
      padding: '2px 8px',
      backgroundColor: isDiff 
        ? (isLeft ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)')
        : 'transparent',
      borderLeft: isDiff 
        ? `4px solid ${isLeft ? theme.palette.error.main : theme.palette.success.main}`
        : '4px solid transparent',
      color: isDiff 
        ? (isLeft ? theme.palette.error.main : theme.palette.success.main)
        : theme.palette.text.primary,
      fontWeight: isDiff ? 'bold' : 'normal',
    };

    return (
      <div key={index} style={lineStyle}>
        {line}
      </div>
    );
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%', overflow: 'auto' }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Back to Editor
      </Button>

      <Typography variant="h5" gutterBottom>
        JSON Diff View
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            p: 2,
            backgroundColor: theme.palette.background.paper,
            maxHeight: '80vh',
            overflow: 'auto'
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Removed/Changed
          </Typography>
          <Box sx={{ fontFamily: 'monospace' }}>
            {leftLines.map((line, index) => renderDiffLine(line, index, true))}
          </Box>
        </Paper>

        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            p: 2,
            backgroundColor: theme.palette.background.paper,
            maxHeight: '80vh',
            overflow: 'auto'
          }}
        >
          <Typography variant="h6" color="success.main" gutterBottom>
            Added/Changed
          </Typography>
          <Box sx={{ fontFamily: 'monospace' }}>
            {rightLines.map((line, index) => renderDiffLine(line, index, false))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default JsonDiffView; 