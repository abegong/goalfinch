import React from 'react';
import { Box, Typography } from '@mui/material';
import { Captions } from '../../types/slide_groups';

interface SlideGroupCaptionsProps {
  captions: Captions;
}

const SlideGroupCaptions: React.FC<SlideGroupCaptionsProps> = ({ captions }) => {
  return (
    <Box sx={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none'
    }}>
      {captions.top_center && (
        <Typography sx={{ 
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          margin: '8px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '22px'
        }}>
          {captions.top_center}
        </Typography>
      )}
      {captions.bottom_center && (
        <Typography sx={{ 
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          margin: '8px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '22px'
        }}>
          {captions.bottom_center}
        </Typography>
      )}
      {captions.bottom_left && (
        <Typography sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          margin: '8px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '22px'
        }}>
          {captions.bottom_left}
        </Typography>
      )}
      {captions.bottom_right && (
        <Typography sx={{ 
          position: 'absolute',
          bottom: 0,
          right: 0,
          padding: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '4px',
          margin: '8px',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '22px'
        }}>
          {captions.bottom_right}
        </Typography>
      )}
    </Box>
  );
};

export default SlideGroupCaptions;
