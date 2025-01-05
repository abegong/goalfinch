import React, { useState, useEffect, useContext } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { LayoutContext } from '../Layout';
import { useSlideGroups } from '../../context/SlideContext';
import { SlideType } from '../../types/slides';
import DashboardControlBar from '../DashboardControlBar';
import { ChartSlideGroupConfig } from '../../types/editors';
import { PictureSlideGroupConfig } from '../../types/editors';
import { BulletSlideGroupConfig } from '../../types/editors';
import ChartSlideGroup from '../slides/ChartSlide';
import PictureSlideGroup from '../slides/GallerySlide';
import BulletListSlideGroup from '../slides/BulletListSlide';

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
  const { slideGroups } = useSlideGroups();
  const [visibleColorIndex, setVisibleColorIndex] = useState(0);
  const [nextColorIndex, setNextColorIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [dashboardControlBarVisible, setDashboardControlBarVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { 
    setAppControlBarVisible,
  } = useContext(LayoutContext);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setNextColorIndex((visibleColorIndex + 1) % slideGroups.length);
      setSlideDirection('left');
      setIsTransitioning(true);
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [visibleColorIndex, slideGroups.length, isPaused]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setVisibleColorIndex(nextColorIndex);
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
        const prevIndex = (visibleColorIndex - 1 + slideGroups.length) % slideGroups.length;
        setNextColorIndex(prevIndex);
        setSlideDirection('right');
        setIsTransitioning(true);
      } else if (event.key === 'ArrowRight') {
        const nextIndex = (visibleColorIndex + 1) % slideGroups.length;
        setNextColorIndex(nextIndex);
        setSlideDirection('left');
        setIsTransitioning(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dashboardControlBarVisible, setAppControlBarVisible, visibleColorIndex, slideGroups.length]);

  const handleColorClick = (index: number) => {
    setNextColorIndex(index);
    setSlideDirection('left');
    setIsTransitioning(true);
  };

  const handleMenuClick = () => {
    const newState = !dashboardControlBarVisible;
    setAppControlBarVisible(newState);
    setDashboardControlBarVisible(newState);
  };

  const renderSlide = (slide: any, props: any) => {
    switch (slide.type) {
      case SlideType.CHART:
        return <ChartSlideGroup slide={slide} {...props} />;
      case SlideType.PICTURE:
        return <PictureSlideGroup
          slide={slide}
          backgroundImage={"http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png"}
          {...props}
        />;
      case SlideType.BULLETS:
        return <BulletListSlideGroup slide={slide} {...props} />;
      default:
        console.warn(`Unknown slide type: ${slide.type}`);
        return null;
    }
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

      {isTransitioning && renderSlide(slideGroups[visibleColorIndex], {
        backgroundColor: colors[visibleColorIndex % colors.length].hex,
        position: 'absolute',
        transform: `translateX(${slideDirection === 'left' ? '-100%' : '100%'})`,
        opacity: 0,
      })}
      <DashboardControlBar 
        visible={dashboardControlBarVisible}
        onClose={() => setDashboardControlBarVisible(false)}
        slides={slideGroups}
        visibleColorIndex={visibleColorIndex}
        onSlideClick={handleColorClick}
      />
      {renderSlide(slideGroups[nextColorIndex], {
        backgroundColor: colors[nextColorIndex % colors.length].hex,
        isTransitioning,
        animationDuration: ANIMATION_DURATION,
        direction: slideDirection
      })}
    </Box>
  );
};

export default Dashboard;
