import React from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';

interface DashboardControlBarProps {
  isPaused: boolean;
  onPauseChange: (paused: boolean) => void;
}

const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  isPaused,
  onPauseChange,
}) => {
  return (
    <Box sx={{ 
      position: 'fixed',
      bottom: 16,
      right: 16,
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 1,
      padding: 1,
      boxShadow: 1,
    }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isPaused}
            onChange={(e) => onPauseChange(e.target.checked)}
          />
        }
        label="Pause Slides"
      />
    </Box>
  );
};

export default DashboardControlBar;
