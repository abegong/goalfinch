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
      position: 'relative',
      bottom: 16,
      left: 16,
      padding: 1,
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
