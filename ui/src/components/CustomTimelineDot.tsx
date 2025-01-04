import React, { useState } from 'react';
import { Box } from '@mui/material';

interface CustomTimelineDotProps {
  onClick: () => void;
  isExpanded: boolean;
  children?: React.ReactNode;
}

const CustomTimelineDot: React.FC<CustomTimelineDotProps> = ({ onClick, isExpanded, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onClick();
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
  };

  return (
    <Box
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}
      data-testid="timeline-dot"
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: isExpanded ? 'primary.main' : 'grey.400',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: isExpanded ? 'primary.dark' : 'grey.500'
        }
      }}
    >
      {children}
    </Box>
  );
};

export default CustomTimelineDot;
