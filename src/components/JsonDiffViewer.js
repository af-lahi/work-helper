import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Tooltip,
  Alert,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ContentCopy, CompareArrows, FormatAlignLeft, FormatAlignRight } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import DiffViewer from 'react-diff-viewer-continued';

const JsonDiffViewer = () => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diff, setDiff] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleShowDiff = () => {
    setError('');
    try {
      const leftObj = JSON.parse(left);
      const rightObj = JSON.parse(right);
      setDiff({ left: JSON.stringify(leftObj, null, 2), right: JSON.stringify(rightObj, null, 2) });
      setSnackbar({ open: true, message: 'Diff generated!' });
    } catch (e) {
      setError('Invalid JSON input');
      setSnackbar({ open: true, message: 'Error: Invalid JSON input' });
    }
  };

  const handleBeautify = (side) => {
    try {
      const value = side === 'left' ? left : right;
      const obj = JSON.parse(value);
      const beautified = JSON.stringify(obj, null, 2);
      if (side === 'left') setLeft(beautified);
      else setRight(beautified);
      setSnackbar({ open: true, message: 'Beautified!' });
    } catch {
      setSnackbar({ open: true, message: 'Error: Invalid JSON' });
    }
  };

  const handleMinify = (side) => {
    try {
      const value = side === 'left' ? left : right;
      const obj = JSON.parse(value);
      const minified = JSON.stringify(obj);
      if (side === 'left') setLeft(minified);
      else setRight(minified);
      setSnackbar({ open: true, message: 'Minified!' });
    } catch {
      setSnackbar({ open: true, message: 'Error: Invalid JSON' });
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to copy' });
    }
  };

  const editorHeight = isMobile ? '40vh' : '70vh';

  return (
    <Box sx={{ height: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        JSON Diff Viewer
      </Typography>
      
      <Grid container spacing={2} sx={{ height: 'calc(100% - 48px)' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Tooltip title="Beautify">
                <Button
                  size="small"
                  onClick={() => handleBeautify('left')}
                  variant="outlined"
                  startIcon={<FormatAlignLeft />}
                >
                  Format
                </Button>
              </Tooltip>
              <Tooltip title="Minify">
                <Button
                  size="small"
                  onClick={() => handleMinify('left')}
                  variant="outlined"
                  startIcon={<FormatAlignRight />}
                >
                  Minify
                </Button>
              </Tooltip>
              <Tooltip title="Copy">
                <Button
                  size="small"
                  onClick={() => handleCopy(left)}
                  variant="outlined"
                  startIcon={<ContentCopy />}
                >
                  Copy
                </Button>
              </Tooltip>
            </Box>
            <Editor
              height={editorHeight}
              defaultLanguage="json"
              value={left}
              onChange={setLeft}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Tooltip title="Beautify">
                <Button
                  size="small"
                  onClick={() => handleBeautify('right')}
                  variant="outlined"
                  startIcon={<FormatAlignLeft />}
                >
                  Format
                </Button>
              </Tooltip>
              <Tooltip title="Minify">
                <Button
                  size="small"
                  onClick={() => handleMinify('right')}
                  variant="outlined"
                  startIcon={<FormatAlignRight />}
                >
                  Minify
                </Button>
              </Tooltip>
              <Tooltip title="Copy">
                <Button
                  size="small"
                  onClick={() => handleCopy(right)}
                  variant="outlined"
                  startIcon={<ContentCopy />}
                >
                  Copy
                </Button>
              </Tooltip>
            </Box>
            <Editor
              height={editorHeight}
              defaultLanguage="json"
              value={right}
              onChange={setRight}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button
              variant="contained"
              onClick={handleShowDiff}
              startIcon={<CompareArrows />}
              sx={{ minWidth: 200 }}
            >
              Compare
            </Button>
          </Box>
        </Grid>

        {diff && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Differences
              </Typography>
              <DiffViewer
                oldValue={diff.left}
                newValue={diff.right}
                splitView={!isMobile}
                useDarkTheme
                hideLineNumbers
              />
            </Paper>
          </Grid>
        )}
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JsonDiffViewer;
