import React, { useState, useEffect, useContext } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { LayoutContext } from './Layout';
import { useSlides } from '../context/SlideContext';
import Slide from './Slide';

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
  const { slides } = useSlides();
  const [visibleColorIndex, setVisibleColorIndex] = useState(0);
  const [nextColorIndex, setNextColorIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dashboardControlBarVisible, setDashboardControlBarVisible] = useState(false);
  const { 
    setAppControlBarVisible,
  } = useContext(LayoutContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextColorIndex((visibleColorIndex + 1) % slides.length);
      setIsTransitioning(true);
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [visibleColorIndex, slides.length]);

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
  };

  const handleMenuClick = () => {
    const newState = !dashboardControlBarVisible;
    setAppControlBarVisible(newState);
    setDashboardControlBarVisible(newState);
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        component="aside"
        aria-label="Dashboard Control Bar"
        anchor="right"
        open={dashboardControlBarVisible}
        onClose={() => setDashboardControlBarVisible(false)}
        hideBackdrop={true}
        variant="persistent"
      >
        <List sx={{ width: 250 }}>
          {slides.map((slide, index) => (
            <ListItem
              key={index}
              onClick={() => handleColorClick(index)}
              sx={{
                '&:hover': {
                  backgroundColor: `${colors[index % colors.length].hex}20`
                }
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: colors[index % colors.length].hex,
                  marginRight: 2,
                  borderRadius: 1
                }}
              />
              <ListItemText primary={`Slide ${index + 1}: ${slide.type}`} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      {isTransitioning && (
        <Slide
          backgroundColor={colors[visibleColorIndex % colors.length].hex}
          text={slides[visibleColorIndex].type}
          isTransitioning={isTransitioning}
          isOutgoing={true}
          animationDuration={ANIMATION_DURATION}
        />
      )}
      <Slide
        backgroundColor={colors[nextColorIndex % colors.length].hex}
        text={slides[nextColorIndex].type}
        isTransitioning={isTransitioning}
        animationDuration={ANIMATION_DURATION}
      />
    </Box>
  );
};

export default Dashboard;
