import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Divider,
  Tooltip,
  TextField,
  Autocomplete
} from '@mui/material';
import { ContentCopy, AccessTime, SwapHoriz } from '@mui/icons-material';
import { format, parse, fromUnixTime, getUnixTime } from 'date-fns';

const timezones = [
  'UTC', 'America/New_York', 'Europe/London', 'Asia/Bangkok', 'Asia/Tokyo', 'Australia/Sydney'
];

const TimestampConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [timezone, setTimezone] = useState('UTC');
  const [mode, setMode] = useState('timestamp-to-date');
  const [localTime, setLocalTime] = useState('');

  // Auto-format date input (YYYY/MM/DD HH:MM:SS)
  const formatDateInput = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format the date part
    let formatted = '';
    if (numbers.length > 0) {
      // Year
      formatted = numbers.slice(0, 4);
      if (numbers.length > 4) {
        formatted += '/' + numbers.slice(4, 6);
        if (numbers.length > 6) {
          formatted += '/' + numbers.slice(6, 8);
          if (numbers.length > 8) {
            formatted += ' ' + numbers.slice(8, 10);
            if (numbers.length > 10) {
              formatted += ':' + numbers.slice(10, 12);
              if (numbers.length > 12) {
                formatted += ':' + numbers.slice(12, 14);
              }
            }
          }
        }
      }
    }
    return formatted;
  };

  // Check if input is valid
  const isValidInput = (value) => {
    if (mode === 'timestamp-to-date') {
      return /^\d+$/.test(value); // Valid timestamp is just numbers
    } else {
      // Valid date format is YYYY/MM/DD HH:MM:SS
      return /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
    }
  };

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    if (mode === 'date-to-timestamp') {
      newValue = formatDateInput(newValue);
    }
    
    setInput(newValue);
    
    // Auto-convert if input is valid
    if (isValidInput(newValue)) {
      handleConvert(newValue);
    } else {
      setOutput('');
      setLocalTime('');
    }
  };

  const handleConvert = (value = input) => {
    setError('');
    try {
      if (mode === 'timestamp-to-date') {
        const date = fromUnixTime(Number(value));
        const utcDate = format(date, 'yyyy/MM/dd HH:mm:ss');
        const localDate = format(date, 'yyyy/MM/dd HH:mm:ss (z)');
        setOutput(utcDate + ` (${timezone})`);
        setLocalTime(localDate);
      } else {
        const date = parse(value, 'yyyy/MM/dd HH:mm:ss', new Date());
        setOutput(getUnixTime(date).toString());
        setLocalTime('');
      }
    } catch (e) {
      setError('Invalid input format');
      setOutput('');
      setLocalTime('');
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Copied to clipboard!' });
    });
  };

  const handleSwap = () => {
    setMode(mode === 'timestamp-to-date' ? 'date-to-timestamp' : 'timestamp-to-date');
    setInput('');
    setOutput('');
    setLocalTime('');
    setError('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: 'auto', mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2 }}><AccessTime sx={{ mr: 1 }} />Timestamp Converter</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Tooltip title="Swap conversion mode" arrow>
          <Button variant="outlined" onClick={handleSwap} startIcon={<SwapHoriz />}>
            {mode === 'timestamp-to-date' ? 'To Date' : 'To Timestamp'}
          </Button>
        </Tooltip>
        <TextField
          label={mode === 'timestamp-to-date' ? 'Unix Timestamp' : 'Date (YYYY/MM/DD HH:MM:SS)'}
          value={input}
          onChange={handleInputChange}
          error={Boolean(error)}
          helperText={error}
          sx={{ minWidth: 220 }}
        />
        <Autocomplete
          options={timezones}
          value={timezone}
          onChange={(_, value) => setTimezone(value || 'UTC')}
          sx={{ minWidth: 180 }}
          renderInput={(params) => <TextField {...params} label="Timezone" />}
        />
        <Tooltip title="Copy result" arrow>
          <Button variant="outlined" onClick={() => handleCopy(output)} startIcon={<ContentCopy />}>Copy</Button>
        </Tooltip>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">UTC Time:</Typography>
        <Paper variant="outlined" sx={{ p: 2, minHeight: 40, bgcolor: '#181818', color: '#fff', mt: 1 }}>
          {output}
        </Paper>
        {localTime && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Local Time:</Typography>
            <Paper variant="outlined" sx={{ p: 2, minHeight: 40, bgcolor: '#181818', color: '#fff', mt: 1 }}>
              {localTime}
            </Paper>
          </>
        )}
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Paper>
  );
};

export default TimestampConverter;
