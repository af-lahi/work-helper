import React from 'react';
import { Box, Paper, Typography, Grid, IconButton } from '@mui/material';
import { 
  AccessTime, 
  Code, 
  EventRepeat, 
  Schema, 
  CompareArrows, 
  Storage, 
  VpnKey
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const tools = [
  {
    name: 'Timestamp Converter',
    path: '/timestamp',
    description: 'Convert and manipulate timestamps',
    icon: <AccessTime sx={{ fontSize: 40 }} />,
    color: '#10b981' // Emerald
  },
  {
    name: 'Regex Tester',
    path: '/regex',
    description: 'Test and explain regular expressions',
    icon: <Code sx={{ fontSize: 40 }} />,
    color: '#6366f1' // Indigo
  },
  {
    name: 'Cron Tester',
    path: '/cron',
    description: 'Parse and preview cron schedules',
    icon: <EventRepeat sx={{ fontSize: 40 }} />,
    color: '#8b5cf6' // Purple
  },
  {
    name: 'JSON Schema',
    path: '/json-schema',
    description: 'Generate JSON schemas from data',
    icon: <Schema sx={{ fontSize: 40 }} />,
    color: '#f59e0b' // Amber
  },
  {
    name: 'JSON Diff',
    path: '/json-diff',
    description: 'Compare JSON objects',
    icon: <CompareArrows sx={{ fontSize: 40 }} />,
    color: '#3b82f6' // Blue
  },
  {
    name: 'SQL Diff',
    path: '/sql-diff',
    description: 'Compare and format SQL queries',
    icon: <Storage sx={{ fontSize: 40 }} />,
    color: '#ec4899' // Pink
  },
  {
    name: 'JWT Decoder',
    path: '/jwt',
    description: 'Decode and inspect JWT tokens',
    icon: <VpnKey sx={{ fontSize: 40 }} />,
    color: '#14b8a6' // Teal
  }
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      maxWidth: '1600px', 
      mx: 'auto', 
      p: { xs: 2, sm: 4 },
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography 
        variant="h3" 
        sx={{ 
          mb: 1, 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Developer Tools
      </Typography>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 6, 
          color: 'text.secondary',
          maxWidth: 600
        }}
      >
        A suite of modern development tools designed to boost your productivity. 
        Each tool is crafted with attention to detail and optimized for efficiency.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {tools.map((tool, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={tool.path}
            sx={{
              ...(index === tools.length - 1 && {
                md: {
                  flexBasis: '33.333%',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }
              })
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => `0 12px 24px ${theme.palette.background.paper}`,
                  '& .tool-icon': {
                    transform: 'scale(1.1)',
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: tool.color,
                  opacity: 0.8
                }
              }}
              onClick={() => navigate(tool.path)}
            >
              <Box sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <IconButton 
                  className="tool-icon"
                  sx={{ 
                    backgroundColor: `${tool.color}20`,
                    color: tool.color,
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: `${tool.color}30`,
                    }
                  }}
                >
                  {tool.icon}
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {tool.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {tool.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
