import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  IconButton,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import StorageIcon from '@mui/icons-material/Storage';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';

const tools = [
  {
    title: 'JSON Diff',
    description: 'Compare and format JSON files',
    icon: <CompareArrowsIcon />,
    path: '/json-diff'
  },
  {
    title: 'SQL Diff',
    description: 'Compare and format SQL queries',
    icon: <StorageIcon />,
    path: '/sql-diff'
  },
  {
    title: 'Unix Time Converter',
    description: 'Convert between Unix timestamp and date/time',
    icon: <AccessTimeIcon />,
    path: '/unix-converter'
  },
  {
    title: 'JWT Debugger',
    description: 'Decode and verify JSON Web Tokens',
    icon: <SecurityIcon />,
    path: '/jwt-debugger'
  }
];

const LandingPage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.path}>
            <Link to={tool.path} style={{ textDecoration: 'none' }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <IconButton
                  size="large"
                  sx={{
                    mb: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark
                    }
                  }}
                >
                  {tool.icon}
                </IconButton>
                <Typography variant="h6" component="h2" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {tool.description}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LandingPage; 