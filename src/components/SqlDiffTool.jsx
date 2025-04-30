import React, { useState, useRef } from 'react';
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
import { useNavigate } from 'react-router-dom';
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
  const theme = useTheme();
  const diffRef = useRef(null);
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');
  const [error, setError] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState({ left: [], right: [] });
  const [dialect, setDialect] = useState('sql');

  const formatSql = (sql, dialect) => {
    try {
      if (!sql.trim()) return '';
      return format(sql, { language: dialect });
    } catch (e) {
      return sql;
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
        setError('Please enter SQL in both editors');
        return;
      }

      const leftFormatted = formatSql(leftValue, dialect);
      const rightFormatted = formatSql(rightValue, dialect);
      
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
      setError('Invalid SQL format');
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
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>SQL Dialect</InputLabel>
          <Select
            value={dialect}
            label="SQL Dialect"
            onChange={(e) => setDialect(e.target.value)}
          >
            {SQL_DIALECTS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2, height: 'calc(100vh - 200px)' }}>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Original SQL</Typography>
            <ButtonGroup size="small" variant="contained">
              <Button onClick={() => setLeftValue(formatSql(leftValue, dialect))}>
                Beautify
              </Button>
              <Button onClick={() => setLeftValue(leftValue.replace(/\s+/g, ' ').trim())}>
                Minify
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="sql"
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
            <Typography variant="h6">Modified SQL</Typography>
            <ButtonGroup size="small" variant="contained">
              <Button onClick={() => setRightValue(formatSql(rightValue, dialect))}>
                Beautify
              </Button>
              <Button onClick={() => setRightValue(rightValue.replace(/\s+/g, ' ').trim())}>
                Minify
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="sql"
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
          Compare SQL
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

export default SqlDiffTool; 