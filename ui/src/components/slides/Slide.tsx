import React from 'react';
import { Box, Typography } from '@mui/material';
import { Captions } from '../../types/slide_groups';

interface SlideProps {
  backgroundColor?: string;
  backgroundImage?: string;
  text: string;
  isTransitioning: boolean;
  isOutgoing?: boolean;
  animationDuration: number;
  children?: React.ReactNode;
  captions?: Captions;
  direction?: 'left' | 'right' | 'up' | 'down';
}

const colorBlockStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  outline: 'none',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundOrigin: 'content-box',
  backgroundClip: 'content-box'
};

const captionStyles = {
  position: 'absolute' as const,
  color: 'rgb(255, 255, 255, 0.7)',
  fontWeight: 'bold',
  padding: '64px',
  fontSize: '2.4rem',
  maxWidth: '40%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap' as const
};

const Slide: React.FC<SlideProps> = ({
  backgroundColor = 'transparent',
  backgroundImage,
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
    } else if (direction === 'up') {
      return isOutgoing
        ? `slideOutUp ${animationDuration}ms ease-in-out`
        : `slideInDown ${animationDuration}ms ease-in-out`;
    } else if (direction === 'down') {
      return isOutgoing
        ? `slideOutDown ${animationDuration}ms ease-in-out`
        : `slideInUp ${animationDuration}ms ease-in-out`;
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
        textAlign: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'none',
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
        '@keyframes slideOutUp': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(-100%)',
          },
        },
        '@keyframes slideInDown': {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        '@keyframes slideOutDown': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
        '@keyframes slideInUp': {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Typography variant="h1" sx={{ color: 'red', marginLeft: '50%' }}>
        {text}
      </Typography>
      {children}
    </Box>
  );
};

export default Slide;
