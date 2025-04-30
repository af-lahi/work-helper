import React, { useState, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Button, 
  ButtonGroup,
  IconButton,
  useTheme
} from '@mui/material';
import Editor from '@monaco-editor/react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const JsonDiffTool = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const diffRef = useRef(null);
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');
  const [error, setError] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState({ left: [], right: [] });

  const beautifyJson = (json) => {
    try {
      if (!json.trim()) return '';
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };

  const minifyJson = (json) => {
    try {
      if (!json.trim()) return '';
      return JSON.stringify(JSON.parse(json));
    } catch (e) {
      return json;
    }
  };

  const handleLeftChange = (value) => {
    setLeftValue(value);
    setShowDiff(false);
  };

  const handleRightChange = (value) => {
    setRightValue(value);
    setShowDiff(false);
  };

  const calculateDiff = () => {
    try {
      setError('');
      if (!leftValue && !rightValue) {
        setError('Please enter JSON in both editors');
        return;
      }

      const leftFormatted = beautifyJson(leftValue);
      const rightFormatted = beautifyJson(rightValue);
      
      const leftLines = leftFormatted.split('\n');
      const rightLines = rightFormatted.split('\n');
      
      const diff = {
        left: leftLines.map(line => ({ text: line, type: 'unchanged' })),
        right: rightLines.map(line => ({ text: line, type: 'unchanged' }))
      };

      // Find differences
      for (let i = 0; i < Math.max(leftLines.length, rightLines.length); i++) {
        const leftLine = leftLines[i] || '';
        const rightLine = rightLines[i] || '';
        
        if (leftLine !== rightLine) {
          if (leftLine) {
            diff.left[i] = { text: leftLine, type: 'removed' };
          }
          if (rightLine) {
            diff.right[i] = { text: rightLine, type: 'added' };
          }
        }
      }

      setDiffResult(diff);
      setShowDiff(true);
      setTimeout(() => {
        diffRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      setError('Invalid JSON format');
      setShowDiff(false);
    }
  };

  const renderDiffLine = (line) => {
    const style = {
      padding: '2px 4px',
      margin: '1px 0',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      backgroundColor: line.type === 'added' ? 'rgba(76, 175, 80, 0.2)' : 
                     line.type === 'removed' ? 'rgba(244, 67, 54, 0.2)' : 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000'
    };

    return (
      <div style={style}>
        {line.text}
      </div>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2, height: 'calc(100vh - 200px)' }}>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Original JSON</Typography>
            <ButtonGroup size="small" variant="contained">
              <Button onClick={() => setLeftValue(beautifyJson(leftValue))}>
                Beautify
              </Button>
              <Button onClick={() => setLeftValue(minifyJson(leftValue))}>
                Minify
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="json"
              value={leftValue}
              onChange={handleLeftChange}
              theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                formatOnPaste: true,
                formatOnType: true,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Modified JSON</Typography>
            <ButtonGroup size="small" variant="contained">
              <Button onClick={() => setRightValue(beautifyJson(rightValue))}>
                Beautify
              </Button>
              <Button onClick={() => setRightValue(minifyJson(rightValue))}>
                Minify
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="json"
              value={rightValue}
              onChange={handleRightChange}
              theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                formatOnPaste: true,
                formatOnType: true,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </Box>
        </Paper>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'sticky', top: 0, zIndex: 1, backgroundColor: theme.palette.background.default, padding: '8px 0' }}>
        <Button
          variant="contained"
          startIcon={<CompareArrowsIcon />}
          onClick={calculateDiff}
          disabled={!leftValue || !rightValue}
        >
          Compare JSON
        </Button>
      </Box>
      {showDiff && (
        <Paper elevation={3} sx={{ height: 'calc(100vh - 200px)' }} ref={diffRef}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            Differences
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2, height: 'calc(100% - 64px)', overflow: 'auto' }}>
            <Box sx={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              backgroundColor: 'background.paper',
              borderRadius: '4px',
              padding: '8px',
              overflow: 'auto',
              height: '100%'
            }}>
              {diffResult.left.map((line, index) => (
                <div key={index}>
                  {renderDiffLine(line)}
                </div>
              ))}
            </Box>
            <Box sx={{ 
              fontFamily: 'monospace', 
              fontSize: '14px',
              backgroundColor: 'background.paper',
              borderRadius: '4px',
              padding: '8px',
              overflow: 'auto',
              height: '100%'
            }}>
              {diffResult.right.map((line, index) => (
                <div key={index}>
                  {renderDiffLine(line)}
                </div>
              ))}
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default JsonDiffTool; 