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
const ANIMATION_DURATION = 200;
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
  const [activeSlideGroupIndex, setActiveSlideGroupIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
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
    console.log('goToNextSlide');
    let nextSlideIndex = activeSlideIndex + 1;
    let nextSlideGroupIndex = activeSlideGroupIndex;

    const currentGroup = slideGroups[activeSlideGroupIndex];
    if( nextSlideIndex >= currentGroup.slides.length ) {
      console.log("here")
      nextSlideIndex = 0;
      nextSlideGroupIndex += 1;
      if( nextSlideGroupIndex >= slideGroups.length ) {
        nextSlideGroupIndex = 0;
      }
      setActiveSlideGroupIndex(nextSlideGroupIndex);
    }
    console.log(activeSlideGroupIndex, activeSlideIndex, nextSlideIndex, nextSlideGroupIndex, currentGroup.slides.length);

    setActiveSlideIndex(nextSlideIndex);
    // setSlideDirection('left');
    // setIsTransitioning(true);

    // const isLastSlide = activeSlideGroupIndex === slideGroups[activeSlideGroupIndex].slides.length - 1;
    // if (isLastSlide) {
    //   goToNextSlideGroup();
    // } else {
    //   goToNextSlideInGroup();
    // }
  }, [activeSlideGroupIndex, slideGroups.length]);

  /**
   * Transitions to the previous slide.
   * If this is the first slide in a slide group, go to the last slide in the previous group.
   * Otherwise, go to the previous slide in the current group.
   */
  // const goToPrevSlide = useCallback(() => {
  //   const isFirstSlide = activeSlideGroupIndex === 0;
  //   if (isFirstSlide) {
  //     goToPrevSlideGroup();
  //   } else {
  //     goToPrevSlideInGroup();
  //   }
  // }, [activeSlideGroupIndex, slideGroups.length]);

  // /**
  //  * Transitions to the next slide group with a left sliding animation.
  //  * Updates slide group index and triggers transition animation.
  //  */
  // const goToNextSlideGroup = useCallback(() => {
  //   console.log('goToNextSlideGroup');
  //   const nextIndex = (activeSlideGroupIndex + 1) % slideGroups.length;
  //   setActiveSlideGroupIndex(nextIndex);
  //   setSlideDirection('left');
  //   setIsTransitioning(true);
  // }, [activeSlideGroupIndex, slideGroups.length]);

  // /**
  //  * Transitions to the previous slide group with a right sliding animation.
  //  * Updates slide group index and triggers transition animation.
  //  */
  // const goToPrevSlideGroup = useCallback(() => {
  //   const prevIndex = (activeSlideGroupIndex - 1 + slideGroups.length) % slideGroups.length;
  //   setActiveSlideGroupIndex(prevIndex);
  //   setSlideDirection('right');
  //   setIsTransitioning(true);
  // }, [activeSlideGroupIndex, slideGroups.length]);

  // /**
  //  * Advances to the next slide within the current slide group.
  //  * Cycles back to the first slide if at the end of the group.
  //  */
  // const goToNextSlideInGroup = useCallback(() => {
  //   console.log('goToNextSlideInGroup');
  //   const currentGroup = slideGroups[activeSlideGroupIndex];
  //   let nextSlide = activeSlideIndex + 1;
  //   if( nextSlide >= currentGroup.slides.length ) {
  //     nextSlide = 0;
  //   }
  //   setActiveSlideIndex(nextSlide);
  // }, [activeSlideGroupIndex, slideGroups, dashboard, setDashboard]);

  // /**
  //  * Returns to the previous slide within the current slide group.
  //  * Cycles to the last slide if at the beginning of the group.
  //  */
  // const goToPrevSlideInGroup = useCallback(() => {
  //   const currentGroup = slideGroups[activeSlideGroupIndex];
  //   const prevSlide = (activeSlideIndex - 1 + currentGroup.slides.length) % currentGroup.slides.length;
  //   setActiveSlideIndex(prevSlide);
  // }, [activeSlideGroupIndex, slideGroups, activeSlideIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNextSlide();
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, goToNextSlide]);

  // useEffect(() => {
  //   if (isTransitioning) {
  //     const timer = setTimeout(() => {
  //       goToNextSlide();
  //     }, ANIMATION_DURATION);

  //     return () => clearTimeout(timer);
  //   }
  // }, [isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const newState = !dashboardControlBarVisible;
        setAppControlBarVisible(newState);
        setDashboardControlBarVisible(newState);
      } else if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
        setIsPaused(prev => !prev);
      // } else if (event.key === 'ArrowLeft') {
      //   goToPrevSlide();
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
    // goToPrevSlide, 
    // goToNextSlideInGroup, 
    // goToPrevSlideInGroup
  ]);

  /**
   * Handles direct navigation to a specific slide group by index.
   * @param index - The index of the target slide group
   */
  const handleSlideClick = (index: number) => {
    setActiveSlideGroupIndex(index);
    setActiveSlideIndex(0);
    setSlideDirection('left');
    setIsTransitioning(true);
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

      <SlideGroup 
        config={slideGroups[activeSlideGroupIndex]} 
        initialSlideIndex={activeSlideIndex}
      />

      <DashboardControlBar 
        visible={dashboardControlBarVisible}
        onClose={() => setDashboardControlBarVisible(false)}
        slideGroups={slideGroups}
        visibleColorIndex={activeSlideGroupIndex}
        activeSlideIndex={activeSlideIndex}
        onSlideClick={handleSlideClick}
      />
    </Box>
  );
};

export default Dashboard;
