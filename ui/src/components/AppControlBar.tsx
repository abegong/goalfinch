import React from 'react';
import { 
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  MonitorHeart as GoalIcon,
  Settings as SettingsIcon,
  Slideshow as DashboardIcon,
  ExpandCircleDown as ChevronIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Goals', icon: <GoalIcon />, path: '/goals' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

interface AppControlBarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  appControlBarVisible: boolean;
}

export default function AppControlBar({ open, setOpen, appControlBarVisible }: AppControlBarProps) {
  const location = useLocation();
  const theme = useTheme();
  
  return (
    <Drawer
      component="aside"
      aria-label="App Control Bar"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          bgcolor: 'rgb(255, 193, 5)',
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
          width: open ? drawerWidth : theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: open ? drawerWidth : theme.spacing(9),
          },
          transform: appControlBarVisible ? 'none' : 'translateX(-100%)',
          transition: theme.transitions.create(['transform', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
      variant="persistent"
      open={appControlBarVisible}
    >
      <List>
        <ListItem disablePadding sx={{ display: 'block', minHeight: 70 }}>
          <ListItemButton
            component={Link}
            to="/"
            selected={location.pathname === '/'}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              '&.Mui-selected': {
                backgroundColor: 'transparent',
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <Box 
                sx={{ 
                  backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img 
                  src="/goldfinch-logo.svg" 
                  alt="Goal Finch Logo" 
                  style={{ 
                    width: '48px',
                    height: '48px',
                  }} 
                />
              </Box>
            </ListItemIcon>
            <ListItemText 
              primary="Goal Finch"
              primaryTypographyProps={{
                variant: 'h6',
                sx: { 
                  fontWeight: 'bold',
                  color: 'rgb(33, 33, 33)',
                }
              }}
              sx={{ 
                opacity: open ? 1 : 0,
                m: 0
              }} 
            />
          </ListItemButton>
        </ListItem>
        <Divider />
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                }
              }}
            >
              <ListItemIcon 
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'rgb(33, 33, 33)',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  color: 'rgb(33, 33, 33)',
                }} 
              />
            </ListItemButton>
            {item.text === 'Dashboard' && <Divider />}
          </ListItem>
        ))}
      </List>
      <Box sx={{ 
        mt: 'auto', 
        mb: 1,
        display: 'flex',
        justifyContent: 'flex-start',
        pl: 1
      }}>
        <IconButton 
          onClick={() => setOpen(!open)}
          sx={{
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            padding: '12px',
          }}
        >
          <ChevronIcon sx={{ fontSize: 36 }} />
        </IconButton>
      </Box>
    </Drawer>
  );
}
