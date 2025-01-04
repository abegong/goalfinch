import React from 'react';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

interface DashboardToggleButtonProps {
  appControlBarVisible: boolean;
  appControlBarOpen: boolean;
  setAppControlBarOpen: (open: boolean) => void;
}

export const DashboardToggleButton = ({
  appControlBarVisible,
  appControlBarOpen,
  setAppControlBarOpen,
}: DashboardToggleButtonProps) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Box
      id="dashboard-toggle-button"
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: theme.spacing(1),
        ...(appControlBarVisible && location.pathname !== '/dashboard' ? {} : { display: 'none' })
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => setAppControlBarOpen(true)}
        edge="start"
        sx={{ mr: 2, ...(appControlBarOpen && { display: 'none' }) }}
      >
      </IconButton>
    </Box>
  );
};
