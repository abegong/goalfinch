import React, { useState, createContext, useContext } from 'react';
import { 
  Box, 
  CssBaseline,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Typography,
  useTheme
} from '@mui/material';
import {
  EmojiEvents as GoalIcon,
  EventAvailable as EventIcon,
  Article as ReportIcon,
  CheckCircle as InputIcon,
  Settings as SettingsIcon,
  MonitorHeart as DashboardIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandCircleDown as ChevronIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Goals', icon: <GoalIcon />, path: '/goals' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  // { text: 'Events', icon: <EventIcon />, path: '/events' },
  // { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  // { text: 'Input', icon: <InputIcon />, path: '/input' },
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
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
  const theme = useTheme();
  const [headerVisible, setHeaderVisibleState] = useState(true);
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  return (
    <LayoutContext.Provider value={{ headerVisible, setHeaderVisible: setHeaderVisibleState }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              // width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'rgb(255, 193, 5)',
              overflowX: 'hidden',
              whiteSpace: 'nowrap',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              ...(open ? {
                width: drawerWidth,
              } : {
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                  width: theme.spacing(9),
                },
              }),
            },
          }}
          variant="permanent"
          open={open}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            py: 2,
          }}>
            <Box sx={{ 
              mb: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1 
              }}>
                <Link 
                  to="/"
                  style={{ 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box 
                    sx={{ 
                      backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 1.0)' : 'rgba(255, 255, 255, 0.5)',
                      borderRadius: '50%',
                      padding: '0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img 
                      src="/goldfinch-logo.svg" 
                      alt="Goalfinch Logo" 
                      style={{ 
                        width: '64px',
                        height: 'auto',
                        transition: theme.transitions.create(['width', 'max-width'], {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                        }),
                      }} 
                    />
                  </Box>
                  {open && (
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        opacity: open ? 1 : 0,
                        transition: theme.transitions.create('opacity', {
                          easing: theme.transitions.easing.sharp,
                          duration: theme.transitions.duration.enteringScreen,
                        }),
                        color: 'inherit',
                      }}
                    >
                      GoalFinch
                    </Typography>
                  )}
                </Link>
              </Box>
            </Box>
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <>
                {item.text === 'Dashboard' && <Divider />}
                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
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
                </ListItem>
              </>
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
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              sx={{
                transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: theme.transitions.create('transform', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                padding: '12px',
              }}
            >
              <ChevronIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `${theme.spacing(9)}px`,
            ...(open && {
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
              marginLeft: `${drawerWidth}px`,
            }),
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: theme.spacing(1),
            ...(headerVisible ? {} : { display: 'none' })
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
            </IconButton>
          </Box>
          {children}
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
}
