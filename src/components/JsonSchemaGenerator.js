import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Snackbar,
  Divider,
  Tooltip
} from '@mui/material';
import { ContentCopy, Info } from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import Ajv from 'ajv';

const JsonSchemaGenerator = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [schema, setSchema] = useState('');
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [autoValidate, setAutoValidate] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const inferType = (value) => {
    if (value === null) return { type: 'null' };
    if (Array.isArray(value)) return { type: 'array', items: inferType(value[0]) };
    if (typeof value === 'object') {
      const properties = {};
      for (const key in value) {
        properties[key] = inferType(value[key]);
      }
      return { type: 'object', properties };
    }
    return { type: typeof value };
  };

  const handleGenerate = () => {
    setError('');
    try {
      const json = JSON.parse(jsonInput);
      const inferred = inferType(json);
      setSchema(JSON.stringify({ $schema: 'http://json-schema.org/draft-07/schema#', ...inferred }, null, 2));
      setSnackbar({ open: true, message: 'Schema generated!' });
    } catch (e) {
      setError('Invalid JSON input');
      setSnackbar({ open: true, message: 'Error: Invalid JSON input' });
    }
  };

  const handleValidate = useCallback(() => {
    setError('');
    try {
      const ajv = new Ajv();
      const valid = ajv.validate(JSON.parse(schema), JSON.parse(jsonInput));
      setValidationResult(valid);
      setSnackbar({ open: true, message: valid ? 'JSON is valid!' : 'JSON is invalid!' });
    } catch (e) {
      setError('Validation error');
      setSnackbar({ open: true, message: 'Error: Validation error' });
    }
  }, [jsonInput, schema]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({ open: true, message: 'Copied to clipboard' });
    });
  };

  useEffect(() => {
    if (autoValidate && schema && jsonInput) {
      handleValidate();
    }
  }, [jsonInput, schema, autoValidate, handleValidate]);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 900, mx: 'auto', mt: 3, bgcolor: 'background.default' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>JSON Schema Generator</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Editor
          height="180px"
          language="json"
          value={jsonInput}
          onChange={setJsonInput}
          theme="vs-dark"
          options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 180 }}>
          <Tooltip title="Generate JSON schema from input" arrow>
            <Button variant="contained" onClick={handleGenerate}>Generate Schema</Button>
          </Tooltip>
          <Tooltip title="Validate JSON against schema" arrow>
            <Button variant="contained" onClick={handleValidate} disabled={!schema || autoValidate}>Validate</Button>
          </Tooltip>
          <Tooltip title="Copy schema" arrow>
            <Button variant="outlined" onClick={() => handleCopy(schema)} startIcon={<ContentCopy />}>Copy Schema</Button>
          </Tooltip>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Editor
          height="180px"
          language="json"
          value={schema}
          theme="vs-dark"
          options={{ readOnly: true, fontSize: 14, minimap: { enabled: false }, wordWrap: 'on' }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={autoValidate} onChange={e => setAutoValidate(e.target.checked)} />}
          label="Auto-validate"
        />
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {validationResult !== null && (
        <Alert severity={validationResult ? 'success' : 'error'} sx={{ mb: 2 }}>
          {validationResult ? 'JSON is valid against the schema.' : 'JSON is invalid against the schema.'}
        </Alert>
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

export default JsonSchemaGenerator;
