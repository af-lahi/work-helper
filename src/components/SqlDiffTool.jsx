import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Button, 
  ButtonGroup,
  IconButton,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import Editor from '@monaco-editor/react';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'sql-formatter';

const SQL_DIALECTS = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mssql', label: 'SQL Server' },
  { value: 'plsql', label: 'PL/SQL' },
  { value: 'redshift', label: 'Redshift' },
  { value: 'bigquery', label: 'BigQuery' },
];

const SqlDiffTool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');
  const [error, setError] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState({ left: [], right: [] });
  const [dialect, setDialect] = useState('sql');
  const [leftEditor, setLeftEditor] = useState(null);
  const [rightEditor, setRightEditor] = useState(null);

  // Restore values when navigating back from diff view
  useEffect(() => {
    const state = location.state;
    if (state?.leftValue !== undefined) {
      setLeftValue(state.leftValue);
      if (leftEditor) {
        leftEditor.setValue(state.leftValue);
      }
    }
    if (state?.rightValue !== undefined) {
      setRightValue(state.rightValue);
      if (rightEditor) {
        rightEditor.setValue(state.rightValue);
      }
    }
  }, [location.state, leftEditor, rightEditor]);

  const resetScroll = (editor) => {
    if (editor) {
      editor.revealPositionInCenter({ lineNumber: 1, column: 1 });
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

  const handleLeftEditorDidMount = (editor) => {
    setLeftEditor(editor);
  };

  const handleRightEditorDidMount = (editor) => {
    setRightEditor(editor);
  };

  const formatSql = (sql, dialect) => {
    try {
      if (!sql.trim()) return '';
      // Add semicolon if missing to ensure proper formatting
      const sqlWithSemicolon = sql.trim().endsWith(';') ? sql : sql + ';';
      const formatted = format(sqlWithSemicolon, { 
        language: dialect,
        uppercase: true,
        linesBetweenQueries: 2
      });
      return formatted;
    } catch (e) {
      console.error('SQL formatting error:', e);
      return sql;
    }
  };

  const minifySql = (sql) => {
    try {
      if (!sql.trim()) return '';
      // Remove comments
      const withoutComments = sql.replace(/--.*$/gm, '')
                               .replace(/\/\*[\s\S]*?\*\//g, '');
      
      // Remove extra whitespace and newlines
      const minified = withoutComments
        .replace(/\s+/g, ' ')
        .replace(/\s*([,;()])\s*/g, '$1')
        .trim();
      
      return minified;
    } catch (e) {
      console.error('SQL minification error:', e);
      return sql;
    }
  };

  const handleLeftBeautify = () => {
    const formatted = formatSql(leftValue, dialect);
    setLeftValue(formatted);
    if (leftEditor) {
      leftEditor.setValue(formatted);
      resetScroll(leftEditor);
    }
  };

  const handleLeftMinify = () => {
    const minified = minifySql(leftValue);
    setLeftValue(minified);
    if (leftEditor) {
      leftEditor.setValue(minified);
      resetScroll(leftEditor);
    }
  };

  const handleRightBeautify = () => {
    const formatted = formatSql(rightValue, dialect);
    setRightValue(formatted);
    if (rightEditor) {
      rightEditor.setValue(formatted);
      resetScroll(rightEditor);
    }
  };

  const handleRightMinify = () => {
    const minified = minifySql(rightValue);
    setRightValue(minified);
    if (rightEditor) {
      rightEditor.setValue(minified);
      resetScroll(rightEditor);
    }
  };

  const handleLeftReset = () => {
    setLeftValue('');
    if (leftEditor) {
      leftEditor.setValue('');
      resetScroll(leftEditor);
    }
  };

  const handleRightReset = () => {
    setRightValue('');
    if (rightEditor) {
      rightEditor.setValue('');
      resetScroll(rightEditor);
    }
  };

  const calculateDiff = () => {
    try {
      setError('');
      if (!leftValue && !rightValue) {
        setError('Please enter SQL in at least one editor');
        return;
      }

      // Format SQL statements
      const leftFormatted = formatSql(leftValue, dialect);
      const rightFormatted = formatSql(rightValue, dialect);
      
      const leftLines = leftFormatted.split('\n');
      const rightLines = rightFormatted.split('\n');
      
      const diffLines = new Set();
      const processedLines = new Set();

      // Compare lines and find differences
      const findDifferences = () => {
        // Compare each line in both SQL statements
        leftLines.forEach((leftLine, leftIndex) => {
          const trimmedLeft = leftLine.trim();
          if (!trimmedLeft) return;

          let found = false;
          rightLines.forEach((rightLine, rightIndex) => {
            if (processedLines.has(rightIndex)) return;
            
            const trimmedRight = rightLine.trim();
            if (!trimmedRight) return;

            if (trimmedLeft === trimmedRight) {
              found = true;
              processedLines.add(rightIndex);
              return;
            }
          });

          if (!found) {
            diffLines.add(leftIndex);
          }
        });

        // Check for lines in right that weren't matched
        rightLines.forEach((rightLine, rightIndex) => {
          if (processedLines.has(rightIndex)) return;
          
          const trimmedRight = rightLine.trim();
          if (!trimmedRight) return;

          diffLines.add(rightIndex);
        });
      };

      findDifferences();

      // Navigate to diff view with the results
      navigate('/sql-diff-view', {
        state: {
          leftLines,
          rightLines,
          diffLines: Array.from(diffLines).sort((a, b) => a - b),
          leftValue,
          rightValue,
          dialect
        }
      });
    } catch (error) {
      setError('Error comparing SQL: ' + error.message);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>SQL Dialect</InputLabel>
          <Select
            value={dialect}
            label="SQL Dialect"
            onChange={(e) => setDialect(e.target.value)}
          >
            {SQL_DIALECTS.map((d) => (
              <MenuItem key={d.value} value={d.value}>
                {d.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 'calc(100vh - 200px)', position: 'relative' }}>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Original SQL</Typography>
            <ButtonGroup size="small" variant="contained">
              <Button onClick={handleLeftBeautify}>
                Beautify
              </Button>
              <Button onClick={handleLeftMinify}>
                Minify
              </Button>
              <Button onClick={handleLeftReset} color="error">
                Reset
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={leftValue}
              defaultValue=""
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
              onMount={handleLeftEditorDidMount}
            />
          </Box>
        </Paper>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Modified SQL</Typography>
            <ButtonGroup size="small" variant="contained">
              <Button onClick={handleRightBeautify}>
                Beautify
              </Button>
              <Button onClick={handleRightMinify}>
                Minify
              </Button>
              <Button onClick={handleRightReset} color="error">
                Reset
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="sql"
              value={rightValue}
              defaultValue=""
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
              onMount={handleRightEditorDidMount}
            />
          </Box>
        </Paper>
        <Box sx={{ 
          position: 'absolute', 
          left: '50%', 
          top: '50%', 
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }}>
          <Button
            variant="contained"
            onClick={calculateDiff}
            disabled={!leftValue || !rightValue}
            sx={{ 
              minWidth: '40px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              p: 0
            }}
          >
            <CompareArrowsIcon />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SqlDiffTool; 