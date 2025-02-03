import React from 'react';
import { Box, Typography } from '@mui/material';
import { Captions } from '../../types/slide_groups';

interface SlideProps {
  backgroundColor?: string;
  backgroundImage?: string;
  text: string;
  children?: React.ReactNode;
  captions?: Captions;
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

/**
 * Slide handles the rendering of individual slide content.
 * 
 * Layout:
 * - Each slide is absolutely positioned within its container
 * - Content is centered both vertically and horizontally
 * - Background can be either a color or an image
 * - Content maintains its appearance throughout transitions
 */
const Slide: React.FC<SlideProps> = ({
  backgroundColor = 'transparent',
  backgroundImage,
  text,
  children,
  captions,
}) => {
  return (
    <Box
      sx={{
        ...colorBlockStyles,
        textAlign: 'center',
        width: '100%',
        height: '100%',
        backgroundColor,
        backgroundImage: backgroundImage ? `url("${backgroundImage}")` : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      {children}
    </Box>
  );
};

export default Slide;
