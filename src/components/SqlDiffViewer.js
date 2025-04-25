import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Divider,
  Tooltip,
  Alert,
  Select,
  MenuItem
} from '@mui/material';
import { ContentCopy, CompareArrows, FormatAlignLeft, FormatAlignRight, Storage } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import DiffViewer from 'react-diff-viewer-continued';
import { format as sqlFormatter } from 'sql-formatter';

const DIALECTS = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'SQL Server', value: 'sql' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'MariaDB', value: 'mariadb' },
  { label: 'DB2', value: 'db2' },
  { label: 'Pl/SQL', value: 'plsql' }
];

const SqlDiffViewer = () => {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diff, setDiff] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [dialect, setDialect] = useState(() => localStorage.getItem('sqlDialect') || 'mysql');

  useEffect(() => {
    localStorage.setItem('sqlDialect', dialect);
  }, [dialect]);

  const handleShowDiff = () => {
    setError('');
    try {
      setDiff({ left, right });
      setSnackbar({ open: true, message: 'Diff generated!' });
    } catch (e) {
      setError('Error generating diff');
      setSnackbar({ open: true, message: 'Error: Could not generate diff' });
    }
  };

  const handleBeautify = (side) => {
    try {
      const value = side === 'left' ? left : right;
      const formatted = sqlFormatter.format(value, { language: dialect });
      if (side === 'left') setLeft(formatted);
      else setRight(formatted);
      setSnackbar({ open: true, message: 'Beautified!' });
    } catch {
      setSnackbar({ open: true, message: 'Error: Invalid SQL' });
    }
  };

  const handleMinify = (side) => {
    try {
      const value = side === 'left' ? left : right;
      const minified = value.replace(/\s+/g, ' ').trim();
      if (side === 'left') setLeft(minified);
      else setRight(minified);
      setSnackbar({ open: true, message: 'Minified!' });
    } catch {
      setSnackbar({ open: true, message: 'Error: Invalid SQL' });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto', mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>SQL Diff Viewer</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Storage color="primary" />
        <Typography variant="subtitle1">SQL Dialect:</Typography>
        <Select
          value={dialect}
          onChange={e => setDialect(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {DIALECTS.map(d => (
            <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">Left SQL</Typography>
          <Editor
            height="180px"
            language="sql"
            value={left}
            onChange={setLeft}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Tooltip title="Beautify" arrow>
              <Button onClick={() => handleBeautify('left')} startIcon={<FormatAlignLeft />}>Beautify</Button>
            </Tooltip>
            <Tooltip title="Minify" arrow>
              <Button onClick={() => handleMinify('left')}>Minify</Button>
            </Tooltip>
            <Tooltip title="Copy" arrow>
              <Button onClick={() => handleCopy(left)} startIcon={<ContentCopy />}>Copy</Button>
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1">Right SQL</Typography>
          <Editor
            height="180px"
            language="sql"
            value={right}
            onChange={setRight}
            theme="vs-dark"
            options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Tooltip title="Beautify" arrow>
              <Button onClick={() => handleBeautify('right')} startIcon={<FormatAlignRight />}>Beautify</Button>
            </Tooltip>
            <Tooltip title="Minify" arrow>
              <Button onClick={() => handleMinify('right')}>Minify</Button>
            </Tooltip>
            <Tooltip title="Copy" arrow>
              <Button onClick={() => handleCopy(right)} startIcon={<ContentCopy />}>Copy</Button>
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Show Diff" arrow>
          <Button variant="contained" onClick={handleShowDiff} startIcon={<CompareArrows />}>Compare</Button>
        </Tooltip>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {diff && (
        <Box sx={{ mb: 2 }}>
          <DiffViewer
            oldValue={diff.left}
            newValue={diff.right}
            splitView
            hideLineNumbers={false}
            showDiffOnly={false}
            styles={{ variables: { light: { diffViewerBackground: '#222', diffViewerColor: '#fff' } } }}
          />
        </Box>
      )}
      <Snackbar
        open={snackbar && snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar && snackbar.message}
      />
    </Paper>
  );
};

export default SqlDiffViewer;
