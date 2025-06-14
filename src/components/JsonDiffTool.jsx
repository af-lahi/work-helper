import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigate, useLocation } from 'react-router-dom';

// Utility function to get type of value
const getType = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

// Find the line containing a key and its value
const findKeyAndValueLines = (lines, key, startIndex = 0) => {
  const keyStr = `"${key}":`;
  let keyLine = -1;
  let valueLine = -1;
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith(keyStr)) {
      keyLine = i;
      // Check if value is on the same line
      const valueMatch = line.match(/:\s*(.+)$/);
      if (valueMatch) {
        valueLine = i;
      } else {
        // Value is on next line
        valueLine = i + 1;
      }
      break;
    }
  }
  
  return { keyLine, valueLine };
};

const JsonDiffTool = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const diffRef = useRef(null);
  const [leftValue, setLeftValue] = useState('');
  const [rightValue, setRightValue] = useState('');
  const [error, setError] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [diffResult, setDiffResult] = useState({ left: [], right: [] });
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

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const renderDiffLine = (line) => {
    const style = {
      padding: '2px 4px',
      margin: '1px 0',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      backgroundColor: line.type === 'added' ? 'rgba(76, 175, 80, 0.2)' : 
                     line.type === 'removed' ? 'rgba(244, 67, 54, 0.2)' : 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      width: '100%',
      display: 'block'
    };

    if (line.isHtml) {
      return (
        <div 
          style={style} 
          dangerouslySetInnerHTML={{ __html: line.text }}
        />
      );
    }

    return (
      <div style={style}>
        {line.text}
      </div>
    );
  };

  const beautifyJson = (json) => {
    try {
      if (!json.trim()) return '';
      const formatted = JSON.stringify(JSON.parse(json), null, 2);
      return formatted;
    } catch (e) {
      return json;
    }
  };

  const minifyJson = (json) => {
    try {
      if (!json.trim()) return '';
      const minified = JSON.stringify(JSON.parse(json));
      return minified;
    } catch (e) {
      return json;
    }
  };

  const handleLeftBeautify = () => {
    const formatted = beautifyJson(leftValue);
    setLeftValue(formatted);
    if (leftEditor) {
      leftEditor.setValue(formatted);
      resetScroll(leftEditor);
    }
  };

  const handleLeftMinify = () => {
    const minified = minifyJson(leftValue);
    setLeftValue(minified);
    if (leftEditor) {
      leftEditor.setValue(minified);
      resetScroll(leftEditor);
    }
  };

  const handleRightBeautify = () => {
    const formatted = beautifyJson(rightValue);
    setRightValue(formatted);
    if (rightEditor) {
      rightEditor.setValue(formatted);
      resetScroll(rightEditor);
    }
  };

  const handleRightMinify = () => {
    const minified = minifyJson(rightValue);
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

  const calculateDiff = (leftJson, rightJson) => {
    try {
      const left = JSON.parse(leftJson);
      const right = JSON.parse(rightJson);
      
      const leftLines = JSON.stringify(left, null, 2).split('\n');
      const rightLines = JSON.stringify(right, null, 2).split('\n');
      
      const diffLines = new Set();
      const processedPaths = new Set();

      // Improved recursive diff finder
      const findDifferences = (leftObj, rightObj, path = '') => {
        if (processedPaths.has(path)) return;
        processedPaths.add(path);

        const leftType = getType(leftObj);
        const rightType = getType(rightObj);

        // Handle type mismatches
        if (leftType !== rightType) {
          const key = path.split('.').pop();
          const leftKeyLines = findKeyAndValueLines(leftLines, key, 0);
          const rightKeyLines = findKeyAndValueLines(rightLines, key, 0);
          
          if (leftKeyLines.keyLine !== -1) {
            diffLines.add(leftKeyLines.keyLine);
            if (leftKeyLines.valueLine !== -1) {
              diffLines.add(leftKeyLines.valueLine);
            }
          }
          
          if (rightKeyLines.keyLine !== -1) {
            diffLines.add(rightKeyLines.keyLine);
            if (rightKeyLines.valueLine !== -1) {
              diffLines.add(rightKeyLines.valueLine);
            }
          }
          return;
        }

        // Handle arrays with improved object comparison
        if (leftType === 'array') {
          const maxLength = Math.max(leftObj.length, rightObj.length);
          for (let i = 0; i < maxLength; i++) {
            const arrayPath = `${path}[${i}]`;
            if (i >= leftObj.length) {
              // Element added in right
              const rightKeyLines = findKeyAndValueLines(rightLines, `[${i}]`, 0);
              if (rightKeyLines.keyLine !== -1) {
                diffLines.add(rightKeyLines.keyLine);
                if (rightKeyLines.valueLine !== -1) {
                  diffLines.add(rightKeyLines.valueLine);
                }
              }
            } else if (i >= rightObj.length) {
              // Element removed from left
              const leftKeyLines = findKeyAndValueLines(leftLines, `[${i}]`, 0);
              if (leftKeyLines.keyLine !== -1) {
                diffLines.add(leftKeyLines.keyLine);
                if (leftKeyLines.valueLine !== -1) {
                  diffLines.add(leftKeyLines.valueLine);
                }
              }
            } else {
              // Deep comparison for array elements
              if (typeof leftObj[i] === 'object' && leftObj[i] !== null) {
                findDifferences(leftObj[i], rightObj[i], arrayPath);
              } else if (JSON.stringify(leftObj[i]) !== JSON.stringify(rightObj[i])) {
                const leftKeyLines = findKeyAndValueLines(leftLines, `[${i}]`, 0);
                const rightKeyLines = findKeyAndValueLines(rightLines, `[${i}]`, 0);
                
                if (leftKeyLines.keyLine !== -1) {
                  diffLines.add(leftKeyLines.keyLine);
                  if (leftKeyLines.valueLine !== -1) {
                    diffLines.add(leftKeyLines.valueLine);
                  }
                }
                
                if (rightKeyLines.keyLine !== -1) {
                  diffLines.add(rightKeyLines.keyLine);
                  if (rightKeyLines.valueLine !== -1) {
                    diffLines.add(rightKeyLines.valueLine);
                  }
                }
              }
            }
          }
          return;
        }

        // Handle objects with improved nested comparison
        if (leftType === 'object' && leftObj !== null) {
          const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
          
          for (const key of allKeys) {
            const newPath = path ? `${path}.${key}` : key;
            
            if (!(key in leftObj)) {
              // Key added in right
              const rightKeyLines = findKeyAndValueLines(rightLines, key, 0);
              if (rightKeyLines.keyLine !== -1) {
                diffLines.add(rightKeyLines.keyLine);
                if (rightKeyLines.valueLine !== -1) {
                  diffLines.add(rightKeyLines.valueLine);
                }
              }
            } else if (!(key in rightObj)) {
              // Key removed from left
              const leftKeyLines = findKeyAndValueLines(leftLines, key, 0);
              if (leftKeyLines.keyLine !== -1) {
                diffLines.add(leftKeyLines.keyLine);
                if (leftKeyLines.valueLine !== -1) {
                  diffLines.add(leftKeyLines.valueLine);
                }
              }
            } else {
              // Deep comparison for nested objects
              if (typeof leftObj[key] === 'object' && leftObj[key] !== null) {
                findDifferences(leftObj[key], rightObj[key], newPath);
              } else if (JSON.stringify(leftObj[key]) !== JSON.stringify(rightObj[key])) {
                const leftKeyLines = findKeyAndValueLines(leftLines, key, 0);
                const rightKeyLines = findKeyAndValueLines(rightLines, key, 0);
                
                if (leftKeyLines.keyLine !== -1) {
                  diffLines.add(leftKeyLines.keyLine);
                  if (leftKeyLines.valueLine !== -1) {
                    diffLines.add(leftKeyLines.valueLine);
                  }
                }
                
                if (rightKeyLines.keyLine !== -1) {
                  diffLines.add(rightKeyLines.keyLine);
                  if (rightKeyLines.valueLine !== -1) {
                    diffLines.add(rightKeyLines.valueLine);
                  }
                }
              }
            }
          }
          return;
        }

        // Handle primitive values
        if (JSON.stringify(leftObj) !== JSON.stringify(rightObj)) {
          const key = path.split('.').pop();
          const leftKeyLines = findKeyAndValueLines(leftLines, key, 0);
          const rightKeyLines = findKeyAndValueLines(rightLines, key, 0);
          
          if (leftKeyLines.keyLine !== -1) {
            diffLines.add(leftKeyLines.keyLine);
            if (leftKeyLines.valueLine !== -1) {
              diffLines.add(leftKeyLines.valueLine);
            }
          }
          
          if (rightKeyLines.keyLine !== -1) {
            diffLines.add(rightKeyLines.keyLine);
            if (rightKeyLines.valueLine !== -1) {
              diffLines.add(rightKeyLines.valueLine);
            }
          }
        }
      };

      // Start the diff process
      findDifferences(left, right);
      
      // Convert Set to Array and sort for consistent output
      return {
        leftLines,
        rightLines,
        diffLines: Array.from(diffLines).sort((a, b) => a - b)
      };
    } catch (error) {
      console.error('Error calculating diff:', error);
      throw error;
    }
  };

  const handleCompareClick = () => {
    if (!leftValue && !rightValue) {
      setError('Please enter JSON in at least one editor');
      return;
    }

    try {
      // Parse JSON to validate
      const leftJson = leftValue ? JSON.parse(leftValue) : {};
      const rightJson = rightValue ? JSON.parse(rightValue) : {};

      // Calculate diff
      const diffResult = calculateDiff(
        JSON.stringify(leftJson, null, 2),
        JSON.stringify(rightJson, null, 2)
      );

      // Navigate to diff view with the results and current values
      navigate('/json-diff-view', {
        state: {
          leftLines: diffResult.leftLines,
          rightLines: diffResult.rightLines,
          diffLines: diffResult.diffLines,
          leftValue: leftValue,
          rightValue: rightValue
        }
      });
    } catch (error) {
      setError('Invalid JSON: ' + error.message);
    }
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
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, height: 'calc(100vh - 200px)', position: 'relative' }}>
        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Original JSON</Typography>
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
              defaultLanguage="json"
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
            <Typography variant="h6">Modified JSON</Typography>
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
              defaultLanguage="json"
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
            onClick={handleCompareClick}
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

export default JsonDiffTool;