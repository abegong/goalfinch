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

/**
 * Slide handles the actual animation and rendering of individual slide content.
 * 
 * Animation Architecture:
 * 1. Base Layout:
 *    - Each slide is absolutely positioned within its SlideGroup
 *    - Initial state (no transition):
 *      - transform: none
 *      - opacity: 1
 *      - No animation applied
 * 
 * 2. Transition States:
 *    For a "right" direction transition (similar for other directions):
 *    
 *    Outgoing Slide (isOutgoing=true):
 *    - Starts at: transform: translateX(0)
 *    - Animates to: transform: translateX(-100%)
 *    - Maintains opacity: 1 throughout
 *    - Uses z-index: 1
 *    
 *    Incoming Slide (isOutgoing=false):
 *    - Starts at: transform: translateX(100%)
 *    - Animates to: transform: translateX(0)
 *    - Maintains opacity: 1 throughout
 *    - Uses z-index: 2
 * 
 * 3. Animation Timing:
 *    - Both slides animate for exactly animationDuration milliseconds
 *    - Uses ease-in-out timing function for smooth acceleration/deceleration
 *    - Both slides must start and end their animations simultaneously
 * 
 * 4. Content Handling:
 *    - All slide content (background, text, etc.) should move as one unit
 *    - Content should maintain its appearance throughout the transition
 *    - No scaling or distortion should occur during animation
 * 
 * 5. Clipping:
 *    - Slides may extend outside their container during animation
 *    - The parent SlideGroup/SlideTransition handles clipping via overflow: hidden
 */
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
    
    if (direction === 'left') {  // Next slide
      return isOutgoing
        ? `slideOutLeft ${animationDuration}ms ease-in-out`    // Current slide exits left
        : `slideInRight ${animationDuration}ms ease-in-out`;   // New slide enters from right
    } else if (direction === 'right') {  // Previous slide
      return isOutgoing
        ? `slideOutRight ${animationDuration}ms ease-in-out`   // Current slide exits right
        : `slideInLeft ${animationDuration}ms ease-in-out`;    // Previous slide enters from left
    } else if (direction === 'up') {
      return isOutgoing
        ? `slideOutUp ${animationDuration}ms ease-in-out`      // Current slide exits up
        : `slideInDown ${animationDuration}ms ease-in-out`;    // New slide enters from bottom
    } else {  // down
      return isOutgoing
        ? `slideOutDown ${animationDuration}ms ease-in-out`    // Current slide exits down
        : `slideInUp ${animationDuration}ms ease-in-out`;      // New slide enters from top
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
        position: 'absolute',
        top: 0,
        left: 0,
        '@keyframes slideOutLeft': {
          '0%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateX(-100%)',
            opacity: 1,
          },
        },
        '@keyframes slideInRight': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
        '@keyframes slideOutRight': {
          '0%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateX(100%)',
            opacity: 1,
          },
        },
        '@keyframes slideInLeft': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: 1,
          },
        },
        '@keyframes slideOutUp': {
          '0%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateY(-100%)',
            opacity: 1,
          },
        },
        '@keyframes slideInDown': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
        },
        '@keyframes slideOutDown': {
          '0%': {
            transform: 'translateY(0)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: 1,
          },
        },
        '@keyframes slideInUp': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: 1,
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: 1,
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
