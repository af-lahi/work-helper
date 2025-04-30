import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Alert,
  IconButton,
  useTheme,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';

const UnixTimeConverter = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [conversionMode, setConversionMode] = useState('datetime-to-unix');
  const [unixTime, setUnixTime] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(Math.floor(now.getTime() / 1000).toString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    if (value.length < dateTime.length) {
      return value;
    }
    
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)} ${digits.slice(8)}`;
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)} ${digits.slice(8, 10)}:${digits.slice(10)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)} ${digits.slice(8, 10)}:${digits.slice(10, 12)}:${digits.slice(12, 14)}`;
    }
  };

  const handleDateTimeChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setDateTime('');
      setUnixTime('');
      setError('');
      return;
    }

    const formatted = formatDateTime(value);
    setDateTime(formatted);

    try {
      const [datePart, timePart = '00:00:00'] = formatted.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes, seconds] = timePart.split(':');

      if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4) {
        const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
        if (!isNaN(date.getTime())) {
          const unix = Math.floor(date.getTime() / 1000);
          setUnixTime(unix.toString());
          setError('');
        } else {
          setError('Invalid date');
        }
      }
    } catch (e) {
      setError('Invalid format');
    }
  };

  const handleUnixTimeChange = (e) => {
    const value = e.target.value;
    setUnixTime(value);
    if (value && !isNaN(value)) {
      const date = new Date(parseInt(value) * 1000);
      if (!isNaN(date.getTime())) {
        // Format date as DD/MM/YYYY HH:MM:SS
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        setDateTime(`${day}/${month}/${year} ${hours}:${minutes}:${seconds}`);
        setError('');
      } else {
        setError('Invalid Unix timestamp');
      }
    } else {
      setDateTime('');
    }
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setConversionMode(newMode);
      setError('');
      if (newMode === 'datetime-to-unix') {
        setUnixTime('');
      } else {
        setDateTime('');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderDateTimeToUnix = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Enter a Date & Time
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date/Time (DD/MM/YYYY HH:MM:SS)"
            value={dateTime}
            onChange={handleDateTimeChange}
            placeholder="Enter date and time"
            helperText="Type numbers only, formatting will be done automatically"
          />
        </Grid>
        {unixTime && (
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Unix Timestamp</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', mr: 1 }}>
                          {unixTime}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(unixTime)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Paper>
  );

  const renderUnixToDateTime = () => (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Enter a Timestamp
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Unix Timestamp"
            value={unixTime}
            onChange={handleUnixTimeChange}
            placeholder="Enter Unix timestamp"
            helperText="Enter seconds since epoch"
          />
        </Grid>
        {dateTime && (
          <Grid item xs={12}>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">Local Time</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', mr: 1 }}>
                          {dateTime}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(dateTime)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">GMT/UTC</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', mr: 1 }}>
                          {new Date(dateTime.split(' ')[0].split('/').reverse().join('-') + 'T' + dateTime.split(' ')[1]).toUTCString()}
                        </Typography>
                        <IconButton size="small" onClick={() => copyToClipboard(new Date(dateTime.split(' ')[0].split('/').reverse().join('-') + 'T' + dateTime.split(' ')[1]).toUTCString())}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">Unix Time Converter</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          The Current Epoch Unix Timestamp
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
            {currentTime}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyToClipboard(currentTime)}
          >
            Copy
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Seconds since Jan 01 1970. (UTC)
        </Typography>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={conversionMode}
          exclusive
          onChange={handleModeChange}
          aria-label="conversion mode"
          fullWidth
        >
          <ToggleButton value="datetime-to-unix" aria-label="date time to unix">
            Date & Time to Unix
          </ToggleButton>
          <ToggleButton value="unix-to-datetime" aria-label="unix to date time">
            Unix to Date & Time
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {conversionMode === 'datetime-to-unix' ? renderDateTimeToUnix() : renderUnixToDateTime()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UnixTimeConverter; 