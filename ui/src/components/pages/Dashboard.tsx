import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { LayoutContext } from '../Layout';
import { useConfig } from '../../context/ConfigContext';
import DashboardControlBar from '../DashboardControlBar';
import SlideTransition from '../slides/SlideTransition';
import { colors } from '../../theme/colors';

/** Total interval between slide transitions in milliseconds */
const TOTAL_INTERVAL = 1000;

/**
 * Dashboard component that manages and displays slide groups with automatic transitions.
 * Features include:
 * - Automatic slide group rotation with configurable intervals
 * - Manual navigation with arrow keys and control bar
 * - Pause/resume functionality
 * - Responsive layout with fullscreen display
 */
const Dashboard: React.FC = () => {
  const { dashboard, setDashboard } = useConfig();
  const slideGroups = dashboard.slideGroups;
  
  // Track which slide is currently visible and which one is coming in
  const [slideGroupIndex, setSlideGroupIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | 'up' | 'down'>('left');
  const [dashboardControlBarVisible, setDashboardControlBarVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { 
    setAppControlBarVisible,
  } = useContext(LayoutContext);

  /**
   * Transitions to the next slide.
   * If this is the last slide in a slide group, go to the first slide in the next group.
   * Otherwise, go to the next slide in the current group.
   */
  const goToNextSlide = useCallback(() => {
    console.log('goToNextSlide', slideGroupIndex, slideIndex);
    const currentGroup = slideGroups[slideGroupIndex];
    let nextSlideIndex = slideIndex + 1;
    let nextGroupIndex = slideGroupIndex;

    // If this is the last slide in the group...
    if (nextSlideIndex >= currentGroup.slides.length) {
      // ...move to next group.
      nextGroupIndex = (slideGroupIndex + 1) % slideGroups.length;
      nextSlideIndex = 0;
      setSlideDirection('left');

    } else {
      // Otherwise, stay in current group, move to next slide
      setSlideDirection('down');
    }
    
    // After animation completes, the current slide becomes the incoming slide
    setSlideGroupIndex(nextGroupIndex);
    setSlideIndex(nextSlideIndex);
  }, [slideGroupIndex, slideIndex, slideGroups]);

  /**
   * Transitions to the previous slide.
   * If this is the first slide in a slide group, go to the last slide in the previous group.
   * Otherwise, go to the previous slide in the current group.
   */
  const goToPrevSlide = useCallback(() => {
    const currentGroup = slideGroups[slideGroupIndex];
    let nextGroupIndex = slideGroupIndex;
    let nextSlideIndex = slideIndex;

    if (slideIndex > 0) {
      // Stay in current group, move to previous slide
      setSlideDirection('up');
    } else {
      // Move to previous group
      nextGroupIndex = (slideGroupIndex - 1 + slideGroups.length) % slideGroups.length;
      nextSlideIndex = currentGroup.slides.length - 1;
      setSlideDirection('right');
    }
    
    // After animation completes, the current slide becomes the incoming slide
    setSlideGroupIndex(nextGroupIndex);
    setSlideIndex(nextSlideIndex);    
  }, [slideGroupIndex, slideIndex, slideGroups]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, goToNextSlide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const newState = !dashboardControlBarVisible;
        setAppControlBarVisible(newState);
        setDashboardControlBarVisible(newState);
      } else if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
        setIsPaused(prev => !prev);
      } else if (event.key === 'ArrowLeft') {
        goToPrevSlide();
      } else if (event.key === 'ArrowRight') {
        goToNextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    dashboardControlBarVisible, 
    setAppControlBarVisible, 
    goToNextSlide,
    goToPrevSlide
  ]);

  /**
   * Handles direct navigation to a specific slide within a slide group.
   * @param groupIndex - The index of the target slide group
   * @param slideIndex - The index of the target slide within the group
   */
  const handleControlBarSlideClick = (groupIndex: number, slideIndex: number) => {
    setSlideDirection('left');
    
    // After animation completes, the incoming slide becomes the current slide
    setSlideGroupIndex(groupIndex);
    setSlideIndex(slideIndex);
  };

  /**
   * Toggles the visibility of the dashboard control bar and app control bar.
   */
  const handleMenuToggleClick = () => {
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
        onClick={handleMenuToggleClick}
        sx={{ 
          position: 'fixed',
          top: 24,
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
        <Menu />
      </IconButton>

      <SlideTransition
        config={slideGroups[slideGroupIndex]}
        slideIndex={slideIndex}
        slideGroupIndex={slideGroupIndex}
        direction={slideDirection}
      />

      <DashboardControlBar 
        visible={dashboardControlBarVisible}
        onClose={() => {
          setAppControlBarVisible(false);
          setDashboardControlBarVisible(false);
        }}
        slideGroups={slideGroups}
        visibleColorIndex={slideGroupIndex % colors.length}
        activeSlideIndex={slideIndex}
        onSlideClick={handleControlBarSlideClick}
        isPaused={isPaused}
        onPauseChange={setIsPaused}
      />
    </Box>
  );
};

export default Dashboard;
