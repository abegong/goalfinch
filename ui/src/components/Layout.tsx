import React from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline,
  IconButton,
  Toolbar, 
  Typography,
  Tooltip
} from '@mui/material';
import {
  Dashboard,
  Flag as GoalIcon,
  Event as EventIcon,
  Assessment as ReportIcon,
  Input as InputIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Goals', icon: <GoalIcon />, path: '/goals' },
  { text: 'Events', icon: <EventIcon />, path: '/events' },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  { text: 'Input', icon: <InputIcon />, path: '/input' },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
              <img 
                src="/goldfinch-logo.svg" 
                alt="Goalfinch Logo" 
                style={{ 
                  height: '64px',
                  width: 'auto',
                  marginRight: '12px'
                }} 
              />
              <Typography variant="h6" noWrap component="div">
                GoalFinch
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.slice(1).map((item) => (
                <Tooltip key={item.text} title={item.text}>
                  <IconButton
                    component={Link}
                    to={item.path}
                    color="inherit"
                    size="large"
                    sx={{ 
                      padding: '12px',
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.4rem',
                        fontWeight: 'bold',
                        stroke: 'currentColor',
                        strokeWidth: 0.4
                      },
                      '&:hover .MuiSvgIcon-root': {
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
          <Tooltip title="Dashboard">
            <IconButton
              component={Link}
              to="/"
              color="inherit"
              size="large"
              sx={{ 
                padding: '12px',
                '& .MuiSvgIcon-root': {
                  fontSize: '2.4rem',
                  fontWeight: 'bold',
                  stroke: 'currentColor',
                  strokeWidth: 0.4
                },
                '&:hover .MuiSvgIcon-root': {
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s'
              }}
            >
              <Dashboard />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
