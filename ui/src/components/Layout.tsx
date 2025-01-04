import React, { useState, createContext } from 'react';
import { 
  Box, 
  CssBaseline,
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
  const [appControlBarOpen, setAppControlBarOpen] = useState(false);
  const [appControlBarVisible, setAppControlBarVisible] = useState(location.pathname !== '/dashboard');
  
  return (
    <LayoutContext.Provider value={{ 
      appControlBarOpen,
      setAppControlBarOpen,
      appControlBarVisible,
      setAppControlBarVisible
    }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppControlBar 
          open={appControlBarOpen}
          setOpen={setAppControlBarOpen}
          visible={appControlBarVisible}
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
