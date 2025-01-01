import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const colors = [
  { hex: '#FF6B6B', name: 'Coral Red' },
  { hex: '#4ECDC4', name: 'Turquoise' },
  { hex: '#45B7D1', name: 'Sky Blue' },
  { hex: '#96CEB4', name: 'Sage Green' },
  { hex: '#FFEEAD', name: 'Cream Yellow' },
  { hex: '#D4A5A5', name: 'Dusty Rose' },
  { hex: '#9B5DE5', name: 'Purple' },
  { hex: '#00BBF9', name: 'Bright Blue' },
  { hex: '#00F5D4', name: 'Mint' },
  { hex: '#FEE440', name: 'Yellow' },
];

const ANIMATION_DURATION = 500; // 500ms for the animation
const TOTAL_INTERVAL = 2000; // 2000ms (2s) total time between starts of animations

const Dashboard: React.FC = () => {
  const [visibleColorIndex, setVisibleColorIndex] = useState(0);
  const [nextColorIndex, setNextColorIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextColorIndex((visibleColorIndex + 1) % colors.length);
      setIsTransitioning(true);
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [visibleColorIndex]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setVisibleColorIndex(nextColorIndex);
        setIsTransitioning(false);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, nextColorIndex]);

  const colorBlockStyles = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      {isTransitioning && (
        <Box
          sx={{
            ...colorBlockStyles,
            backgroundColor: colors[visibleColorIndex].hex,
            animation: `slideOutLeft ${ANIMATION_DURATION}ms ease-in-out`,
            '@keyframes slideOutLeft': {
              '0%': {
                transform: 'translateX(0)',
              },
              '100%': {
                transform: 'translateX(-100%)',
              },
            },
          }}
        >
          <Typography variant="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
            {colors[visibleColorIndex].name}
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          ...colorBlockStyles,
          backgroundColor: colors[nextColorIndex].hex,
          animation: isTransitioning ? `slideInRight ${ANIMATION_DURATION}ms ease-in-out` : 'none',
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
        <Typography variant="h1" sx={{ color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
          {colors[nextColorIndex].name}
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
