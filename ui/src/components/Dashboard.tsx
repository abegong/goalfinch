import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { LayoutContext } from './Layout';

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {headerVisible, setHeaderVisible } = useContext(LayoutContext);

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

  const handleColorClick = (index: number) => {
    setNextColorIndex(index);
    setIsTransitioning(true);
    setHeaderVisible(false);
    setDrawerOpen(false);
  };

  const handleMenuClick = () => {
    const newDrawerState = !drawerOpen;
    setDrawerOpen(newDrawerState);
    
    if (headerVisible) {
      setHeaderVisible(false);
    } else {
      setHeaderVisible(true);
    }
  };

  const colorBlockStyles = {
    width: '100%',
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    outline: 'none'
  };

  return (
    <Box 
      component="div"
      sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        border: 'none',
        outline: 'none',
        padding: 0,
        margin: 0,
        boxSizing: 'border-box'
      }}
    >
      <IconButton
        onClick={handleMenuClick}
        sx={{ 
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          padding: '16px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }
        }}
      >
        <MenuIcon sx={{ fontSize: 32 }} />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        hideBackdrop={true}
        variant="persistent"
      >
        <List sx={{ width: 250 }}>
          {colors.map((color, index) => (
            <ListItem
              key={color.hex}
              onClick={() => handleColorClick(index)}
              sx={{
                '&:hover': {
                  backgroundColor: `${color.hex}20`
                }
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: color.hex,
                  marginRight: 2,
                  borderRadius: 1
                }}
              />
              <ListItemText primary={color.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
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
