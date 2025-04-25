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
  Collapse
} from '@mui/material';
import { ContentCopy, VpnKey, ExpandMore, ExpandLess } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { jwtDecode } from 'jwt-decode';

const JwtDecoder = () => {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [showHeader, setShowHeader] = useState(true);
  const [showPayload, setShowPayload] = useState(true);
  const [showSignature, setShowSignature] = useState(false);

  const handleDecode = () => {
    setError('');
    try {
      const parts = jwt.split('.');
      if (parts.length < 2) throw new Error('Invalid JWT');
      setHeader(JSON.stringify(JSON.parse(atob(parts[0])), null, 2));
      setPayload(JSON.stringify(jwtDecode(jwt), null, 2));
      setSignature(parts[2] || '');
      setSnackbar({ open: true, message: 'JWT decoded!' });
    } catch (e) {
      setError('Invalid JWT');
      setHeader('');
      setPayload('');
      setSignature('');
      setSnackbar({ open: true, message: 'Error: Invalid JWT' });
    }
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: `${label} copied to clipboard!` });
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: 'auto', mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2 }}><VpnKey sx={{ mr: 1 }} />JWT Decoder</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <Editor
          height="80px"
          language="text"
          value={jwt}
          onChange={setJwt}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on', placeholder: 'Paste JWT here' }}
        />
        <Tooltip title="Decode JWT" arrow>
          <Button variant="contained" onClick={handleDecode}>Decode</Button>
        </Tooltip>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 1 }} onClick={() => setShowHeader(v => !v)}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>Header</Typography>
          {showHeader ? <ExpandLess /> : <ExpandMore />}
          <Tooltip title="Copy Header" arrow>
            <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); handleCopy(header, 'Header'); }} startIcon={<ContentCopy />}>Copy</Button>
          </Tooltip>
        </Box>
        <Collapse in={showHeader}>
          <Editor
            height="100px"
            language="json"
            value={header}
            theme="vs-dark"
            options={{ readOnly: true, fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
          />
        </Collapse>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 1 }} onClick={() => setShowPayload(v => !v)}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>Payload</Typography>
          {showPayload ? <ExpandLess /> : <ExpandMore />}
          <Tooltip title="Copy Payload" arrow>
            <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); handleCopy(payload, 'Payload'); }} startIcon={<ContentCopy />}>Copy</Button>
          </Tooltip>
        </Box>
        <Collapse in={showPayload}>
          <Editor
            height="140px"
            language="json"
            value={payload}
            theme="vs-dark"
            options={{ readOnly: true, fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
          />
        </Collapse>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 1 }} onClick={() => setShowSignature(v => !v)}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>Signature</Typography>
          {showSignature ? <ExpandLess /> : <ExpandMore />}
          <Tooltip title="Copy Signature" arrow>
            <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); handleCopy(signature, 'Signature'); }} startIcon={<ContentCopy />}>Copy</Button>
          </Tooltip>
        </Box>
        <Collapse in={showSignature}>
          <Editor
            height="60px"
            language="text"
            value={signature}
            theme="vs-dark"
            options={{ readOnly: true, fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
          />
        </Collapse>
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

export default JwtDecoder;
