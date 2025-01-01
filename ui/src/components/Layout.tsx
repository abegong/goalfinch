import React, { useState, createContext, useContext } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline,
  IconButton,
  Toolbar, 
  Tooltip
} from '@mui/material';
import {
  EmojiEvents as GoalIcon,
  EventAvailable as EventIcon,
  Article as ReportIcon,
  CheckCircle as InputIcon,
  Settings as SettingsIcon,
  MonitorHeart as DashboardIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Goals', icon: <GoalIcon />, path: '/goals' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  // { text: 'Events', icon: <EventIcon />, path: '/events' },
  // { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  // { text: 'Input', icon: <InputIcon />, path: '/input' },
  // { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
];

interface LayoutContextType {
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  headerVisible: true,
  setHeaderVisible: () => {},
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [headerVisible, setHeaderVisibleState] = useState(true);
  
  return (
    <LayoutContext.Provider value={{ headerVisible, setHeaderVisible: setHeaderVisibleState }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            bgcolor: 'rgb(255, 193, 5)',
            transform: headerVisible ? 'translateY(0)' : 'translateY(-100%)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', mr: 3 }}
            >
              <img 
                src="/goldfinch-logo.svg" 
                alt="Goalfinch Logo" 
                style={{ 
                  height: '64px',
                  width: 'auto',
                  marginRight: '12px',
                  backgroundColor: 'rgb(255, 255, 255)',
                  borderRadius: '32px',
                  border: '4px solid rgb(255, 193, 5)',
                }} 
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Tooltip 
                  key={item.text} 
                  title={item.text}
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '1.1rem',
                        padding: '8px 12px',
                        bgcolor: 'rgba(0, 0, 0, 0.8)'
                      }
                    }
                  }}
                >
                  <IconButton
                    component={Link}
                    to={item.path}
                    size="large"
                    sx={{ 
                      color: 'rgb(33, 33, 33)',
                      padding: '12px',
                      position: 'relative',
                      backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.4)' : 'transparent',
                      borderRadius: '50%',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        transform: 'scale(1.1)'
                      },
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
          <Tooltip 
            title="Dashboard"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: '1.1rem',
                  padding: '8px 12px',
                  bgcolor: 'rgba(0, 0, 0, 0.8)'
                }
              }
            }}
          >
            <IconButton
              component={Link}
              to="/dashboard"
              size="large"
              sx={{ 
                color: 'rgb(33, 33, 33)',
                padding: '12px',
                position: 'relative',
                backgroundColor: location.pathname === '/dashboard' ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.4)'
                },
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
              <DashboardIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        mt: headerVisible ? '64px' : '0px',
        bgcolor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        {children}
      </Box>
    </Box>
  </LayoutContext.Provider>
  );
}
