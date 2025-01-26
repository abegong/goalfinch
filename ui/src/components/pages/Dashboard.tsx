import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { LayoutContext } from '../Layout';
import { useConfig } from '../../context/ConfigContext';
import { SlideType } from '../../types/slides';
import DashboardControlBar from '../DashboardControlBar';
import { SlideGroupConfig } from '../../types/slide_groups';
import ChartSlideGroup from '../slides/ChartSlide';
import PictureSlideGroup from '../slides/PictureSlide';
import BulletSlideGroup from '../slides/BulletSlide';
import SlideGroup from '../slides/SlideGroup';

/**
 * Color palette used for slide transitions and visual styling.
 * Each color has a hex value and a descriptive name.
 */
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

/** Duration of slide transition animation in milliseconds */
const ANIMATION_DURATION = 500;
/** Total interval between slide transitions in milliseconds */
const TOTAL_INTERVAL = 2000;

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
  const [slideGroupIndex, setSlideGroupIndex] = useState(0);
  const [nextColorIndex, setNextColorIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [dashboardControlBarVisible, setDashboardControlBarVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { 
    setAppControlBarVisible,
  } = useContext(LayoutContext);

  /**
   * Transitions to the next slide group with a left sliding animation.
   * Updates slide group index and triggers transition animation.
   */
  const goToNextSlide = useCallback(() => {
    const nextIndex = (slideGroupIndex + 1) % slideGroups.length;
    setSlideGroupIndex(nextIndex);
    setNextColorIndex(nextIndex);
    setSlideDirection('left');
    setIsTransitioning(true);
  }, [slideGroupIndex, slideGroups.length]);

  /**
   * Transitions to the previous slide group with a right sliding animation.
   * Updates slide group index and triggers transition animation.
   */
  const goToPrevSlide = useCallback(() => {
    const prevIndex = (slideGroupIndex - 1 + slideGroups.length) % slideGroups.length;
    setSlideGroupIndex(prevIndex);
    setNextColorIndex(prevIndex);
    setSlideDirection('right');
    setIsTransitioning(true);
  }, [slideGroupIndex, slideGroups.length]);

  /**
   * Advances to the next slide within the current slide group.
   * Cycles back to the first slide if at the end of the group.
   */
  const goToNextSlideInGroup = useCallback(() => {
    const currentGroup = slideGroups[slideGroupIndex];
    const nextSlide = (dashboard.activeSlideIndex + 1) % currentGroup.slides.length;
    setDashboard({...dashboard, activeSlideIndex: nextSlide});
  }, [slideGroupIndex, slideGroups, dashboard, setDashboard]);

  /**
   * Returns to the previous slide within the current slide group.
   * Cycles to the last slide if at the beginning of the group.
   */
  const goToPrevSlideInGroup = useCallback(() => {
    const currentGroup = slideGroups[slideGroupIndex];
    const prevSlide = (dashboard.activeSlideIndex - 1 + currentGroup.slides.length) % currentGroup.slides.length;
    setDashboard({...dashboard, activeSlideIndex: prevSlide});
  }, [slideGroupIndex, slideGroups, dashboard, setDashboard]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, goToNextSlide]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setSlideGroupIndex(nextColorIndex);
        setIsTransitioning(false);
      }, ANIMATION_DURATION);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, nextColorIndex]);

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
    goToPrevSlide, 
    goToNextSlideInGroup, 
    goToPrevSlideInGroup
  ]);

  /**
   * Handles direct navigation to a specific slide group by index.
   * @param index - The index of the target slide group
   */
  const handleColorClick = (index: number) => {
    setSlideGroupIndex(index);
    setSlideDirection('left');
    setIsTransitioning(true);
  };

  /**
   * Toggles the visibility of the dashboard control bar and app control bar.
   */
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

      <SlideGroup 
        config={slideGroups[slideGroupIndex]} 
        initialSlideIndex={dashboard.activeSlideIndex}
      />

      <DashboardControlBar 
        visible={dashboardControlBarVisible}
        onClose={() => setDashboardControlBarVisible(false)}
        slideGroups={slideGroups}
        visibleColorIndex={slideGroupIndex}
        activeSlideIndex={dashboard.activeSlideIndex}
        onSlideClick={handleColorClick}
      />
    </Box>
  );
};

export default Dashboard;
