import React from 'react';
import { Box, Typography } from '@mui/material';

interface SlideProps {
  backgroundColor: string;
  text: string;
  isTransitioning: boolean;
  isOutgoing?: boolean;
  animationDuration: number;
  children?: React.ReactNode;
}

const colorBlockStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  outline: 'none'
};

const Slide: React.FC<SlideProps> = ({
  backgroundColor,
  text,
  isTransitioning,
  isOutgoing = false,
  animationDuration,
  children
}) => {
  const animation = isTransitioning
    ? isOutgoing
      ? `slideOutLeft ${animationDuration}ms ease-in-out`
      : `slideInRight ${animationDuration}ms ease-in-out`
    : 'none';

  return (
    <Box
      sx={{
        ...colorBlockStyles,
        backgroundColor,
        animation,
        '@keyframes slideOutLeft': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        '@keyframes slideInRight': {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
      }}
    >
      {text && (
        <Typography variant="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          {text}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default Slide;
