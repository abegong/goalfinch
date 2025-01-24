import React, { useState, useEffect, useContext } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { LayoutContext } from '../Layout';
import { useConfig } from '../../context/ConfigContext';
import { SlideType } from '../../types/slides';
import DashboardControlBar from '../DashboardControlBar';
import { SlideGroupConfig } from '../../types/slide_groups';
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
  const { dashboard } = useConfig();
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

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setNextColorIndex((slideGroupIndex + 1) % slideGroups.length);
      setSlideDirection('left');
      setIsTransitioning(true);
    }, TOTAL_INTERVAL);

    return () => clearInterval(interval);
  }, [slideGroupIndex, slideGroups.length, isPaused]);

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
        const prevIndex = (slideGroupIndex - 1 + slideGroups.length) % slideGroups.length;
        setSlideGroupIndex(prevIndex);
        setNextColorIndex(prevIndex);
        setSlideDirection('right');
        setIsTransitioning(true);
      } else if (event.key === 'ArrowRight') {
        const nextIndex = (slideGroupIndex + 1) % slideGroups.length;
        setSlideGroupIndex(nextIndex);
        setNextColorIndex(nextIndex);
        setSlideDirection('left');
        setIsTransitioning(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dashboardControlBarVisible, setAppControlBarVisible, slideGroupIndex, slideGroups.length]);

  const handleColorClick = (index: number) => {
    setSlideGroupIndex(index);
    setSlideDirection('left');
    setIsTransitioning(true);
  };

  const handleMenuClick = () => {
    const newState = !dashboardControlBarVisible;
    setAppControlBarVisible(newState);
    setDashboardControlBarVisible(newState);
  };

  const renderSlideGroup = (config: SlideGroupConfig, props: any) => {
    switch (config.type) {
      case SlideType.CHART:
        return <ChartSlideGroup slide={config} {...props} />;
      case SlideType.PICTURE:
        return <PictureSlideGroup
          slide={config}
          backgroundImage={"http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png"}
          {...props}
        />;
      case SlideType.BULLETS:
        return <BulletListSlideGroup slide={config} {...props} />;
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

      {isTransitioning && renderSlideGroup(slideGroups[slideGroupIndex], {
        backgroundColor: colors[slideGroupIndex % colors.length].hex,
        position: 'absolute',
        transform: `translateX(${slideDirection === 'left' ? '-100%' : '100%'})`,
        opacity: 0,
      })}
      <DashboardControlBar 
        visible={dashboardControlBarVisible}
        onClose={() => setDashboardControlBarVisible(false)}
        slides={slideGroups}
        visibleColorIndex={slideGroupIndex}
        onSlideClick={handleColorClick}
      />
      {slideGroups.length > 0 && renderSlideGroup(slideGroups[slideGroupIndex], {
        backgroundColor: colors[slideGroupIndex % colors.length].hex,
        isTransitioning,
        animationDuration: ANIMATION_DURATION,
        direction: slideDirection
      })}
    </Box>
  );
};

export default Dashboard;
