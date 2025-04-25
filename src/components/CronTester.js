import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Divider,
  Tooltip
} from '@mui/material';
import { ContentCopy, Info, ErrorOutline, Schedule } from '@mui/icons-material';
import parser from 'cron-parser';
import cronstrue from 'cronstrue';
import { format } from 'date-fns';

const CronTester = () => {
  const [expression, setExpression] = useState('');
  const [nextRuns, setNextRuns] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const templates = {
    'Every Minute': '* * * * *',
    'Every Hour': '0 * * * *',
    'Every Day': '0 0 * * *',
    'Every Week': '0 0 * * 0',
    'Every Month': '0 0 1 * *',
    'Every Year': '0 0 1 1 *',
  };

  const handleTest = () => {
    setError('');
    try {
      const interval = parser.parseExpression(expression);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(format(interval.next().toDate(), 'yyyy-MM-dd HH:mm:ss'));
      }
      setNextRuns(runs);
      setDescription(cronstrue.toString(expression));
      setSnackbar({ open: true, message: 'Valid cron expression!' });
    } catch (e) {
      setError('Invalid cron expression');
      setSnackbar({ open: true, message: 'Error: Invalid cron expression' });
      setNextRuns([]);
      setDescription('');
    }
  };

  const handleTemplate = (value) => {
    setExpression(value);
    setSelectedTemplate(value);
    setTimeout(handleTest, 100);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(expression);
    setSnackbar({ open: true, message: 'Cron expression copied to clipboard' });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Cron Tester</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Tooltip title="Common cron templates" arrow>
          <Select
            value={selectedTemplate}
            displayEmpty
            onChange={e => handleTemplate(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value=""><em>Templates</em></MenuItem>
            {Object.entries(templates).map(([label, value]) => (
              <MenuItem key={label} value={value}>{label}</MenuItem>
            ))}
          </Select>
        </Tooltip>
        <TextField
          label="Cron Expression"
          value={expression}
          onChange={e => setExpression(e.target.value)}
          sx={{ minWidth: 220 }}
          InputProps={{ startAdornment: <Schedule fontSize="small" sx={{ mr: 1 }} /> }}
        />
        <Tooltip title="Copy cron expression" arrow>
          <Button variant="outlined" onClick={handleCopy} startIcon={<ContentCopy />}>Copy</Button>
        </Tooltip>
        <Tooltip title="Test cron expression" arrow>
          <Button variant="contained" onClick={handleTest}>Test</Button>
        </Tooltip>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Divider sx={{ my: 2 }} />
      {description && (
        <Alert severity="info" sx={{ mb: 2 }}>{description}</Alert>
      )}
      {nextRuns.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">Next 5 Runs:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {nextRuns.map((run, idx) => (
              <li key={idx}>
                <Typography variant="body2">{run}</Typography>
              </li>
            ))}
          </Box>
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

export default CronTester;
