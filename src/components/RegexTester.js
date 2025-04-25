import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Divider,
  Tooltip,
  Alert,
  TextField
} from '@mui/material';
import { 
  ContentCopy, 
  Search, 
  FormatColorFill 
} from '@mui/icons-material';

const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleTest = () => {
    setError('');
    try {
      const regex = new RegExp(pattern, 'g');
      const matches = input.match(regex);
      setResult(matches ? matches.join(', ') : 'No match');
      setSnackbar({ open: true, message: matches ? 'Matches found!' : 'No match found.' });
    } catch (e) {
      setError('Invalid regex pattern');
      setSnackbar({ open: true, message: 'Error: Invalid regex pattern' });
    }
  };

  const handleHighlight = () => {
    setError('');
    try {
      const regex = new RegExp(pattern, 'g');
      const highlighted = input.replace(regex, match => `<mark>${match}</mark>`);
      setResult(highlighted);
      setSnackbar({ open: true, message: 'Highlighted matches!' });
    } catch (e) {
      setError('Invalid regex pattern');
      setSnackbar({ open: true, message: 'Error: Invalid regex pattern' });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: 'auto', mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Regex Tester</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <TextField
          label="Regex Pattern"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          label="Input Text"
          value={input}
          onChange={e => setInput(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Tooltip title="Test regex" arrow>
          <Button variant="contained" onClick={handleTest} startIcon={<Search />}>Test</Button>
        </Tooltip>
        <Tooltip title="Highlight matches" arrow>
          <Button variant="outlined" onClick={handleHighlight} startIcon={<FormatColorFill />}>Highlight</Button>
        </Tooltip>
        <Tooltip title="Copy result" arrow>
          <Button variant="outlined" onClick={() => handleCopy(result)} startIcon={<ContentCopy />}>Copy</Button>
        </Tooltip>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Result:</Typography>
        <Paper variant="outlined" sx={{ p: 2, minHeight: 40, bgcolor: '#181818', color: '#fff', mt: 1 }}>
          <span dangerouslySetInnerHTML={{ __html: result }} />
        </Paper>
      </Box>
      <Snackbar
        open={snackbar && snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar && snackbar.message}
      />
    </Paper>
  );
};

export default RegexTester;
