import React, { useState, createContext } from 'react';
import { 
  Box, 
  CssBaseline,
  IconButton,
  useTheme
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import AppControlBar from './AppControlBar';

interface LayoutContextType {
  appControlBarOpen: boolean;
  setAppControlBarOpen: (open: boolean) => void;
  appControlBarVisible: boolean;
  setAppControlBarVisible: (visible: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextType>({
  appControlBarOpen: true,
  setAppControlBarOpen: (open: boolean) => {
    console.warn('setAppControlBarOpen was called before Provider was initialized');
  },
  appControlBarVisible: true,
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
  const [open, setOpen] = useState(false);
  const [appControlBarVisible, setAppControlBarVisible] = useState(location.pathname !== '/dashboard');
  
  return (
    <LayoutContext.Provider value={{ 
      appControlBarOpen: open,
      setAppControlBarOpen: setOpen,
      appControlBarVisible,
      setAppControlBarVisible
    }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppControlBar 
          open={open}
          setOpen={setOpen}
          appControlBarVisible={appControlBarVisible}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: theme.spacing(3),
            marginLeft: `0px`,
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: theme.spacing(1),
            ...(appControlBarVisible && location.pathname !== '/dashboard' ? {} : { display: 'none' })
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
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
