import React, { useState, createContext, useEffect } from 'react';
import { 
  Box, 
  CssBaseline,
  useTheme
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import AppControlBar from './AppControlBar';
import { useConfig } from '../context/ConfigContext';

interface LayoutContextType {
  appControlBarOpen: boolean;
  setAppControlBarOpen: (open: boolean) => void;
  appControlBarVisible: boolean;
  setAppControlBarVisible: (visible: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  appControlBarOpen: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAppControlBarOpen: (open: boolean) => {
    console.warn('setAppControlBarOpen was called before Provider was initialized');
  },
  appControlBarVisible: true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setAppControlBarVisible: (visible: boolean) => {
    console.warn('setAppControlBarVisible was called before Provider was initialized');
  },
});

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const theme = useTheme();
  const { app, setApp } = useConfig();

  const setAppControlBarOpen = (open: boolean) => {
    setApp(prev => ({
      ...prev,
      appControlBar: {
        ...prev.appControlBar,
        open
      }
    }));
  };

  const setAppControlBarVisible = (visible: boolean) => {
    setApp(prev => ({
      ...prev,
      appControlBar: {
        ...prev.appControlBar,
        visible
      }
    }));
  };

  // Initialize visibility based on route
  useEffect(() => {
    setAppControlBarVisible(location.pathname !== '/dashboard');
  }, [location.pathname]);

  return (
    <LayoutContext.Provider value={{ 
      appControlBarOpen: app.appControlBar.open,
      setAppControlBarOpen,
      appControlBarVisible: app.appControlBar.visible,
      setAppControlBarVisible
    }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppControlBar 
          open={app.appControlBar.open}
          setOpen={setAppControlBarOpen}
          visible={app.appControlBar.visible}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: theme.spacing(3),
            marginLeft: `0px`,
          }}
        >
          {children}
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
}
