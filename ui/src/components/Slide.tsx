import React from 'react';
import { Box, Typography } from '@mui/material';
import { Captions } from '../data/slide_interfaces';

interface SlideProps {
  backgroundColor: string;
  text: string;
  isTransitioning: boolean;
  isOutgoing?: boolean;
  animationDuration: number;
  children?: React.ReactNode;
  captions?: Captions;
  direction?: 'left' | 'right';
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

const captionStyles = {
  position: 'absolute' as const,
  color: 'white',
  padding: '16px',
  fontSize: '1.1rem',
  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  maxWidth: '40%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const
};

const Slide: React.FC<SlideProps> = ({
  backgroundColor,
  text,
  isTransitioning,
  isOutgoing = false,
  animationDuration,
  children,
  captions,
  direction = 'left'
}) => {
  const getAnimation = () => {
    if (!isTransitioning) return 'none';
    
    if (direction === 'left') {
      return isOutgoing
        ? `slideOutLeft ${animationDuration}ms ease-in-out`
        : `slideInRight ${animationDuration}ms ease-in-out`;
    } else {
      return isOutgoing
        ? `slideOutRight ${animationDuration}ms ease-in-out`
        : `slideInLeft ${animationDuration}ms ease-in-out`;
    }
  };

  return (
    <Box
      sx={{
        ...colorBlockStyles,
        backgroundColor,
        animation: getAnimation(),
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
        '@keyframes slideOutRight': {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        '@keyframes slideInLeft': {
          '0%': {
            transform: 'translateX(-100%)',
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
      
      {/* Captions */}
      {captions?.top_center && (
        <Typography sx={{ 
          ...captionStyles, 
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          {captions.top_center}
        </Typography>
      )}
      {captions?.bottom_center && (
        <Typography sx={{ 
          ...captionStyles, 
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          {captions.bottom_center}
        </Typography>
      )}
      {captions?.bottom_left && (
        <Typography sx={{ 
          ...captionStyles, 
          bottom: 0,
          left: 0
        }}>
          {captions.bottom_left}
        </Typography>
      )}
      {captions?.bottom_right && (
        <Typography sx={{ 
          ...captionStyles, 
          bottom: 0,
          right: 0,
          textAlign: 'right'
        }}>
          {captions.bottom_right}
        </Typography>
      )}
    </Box>
  );
};

export default Slide;
