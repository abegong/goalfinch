import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { LayoutContext } from '../Layout';
import { useConfig } from '../../context/ConfigContext';
import DashboardControlBar from '../DashboardControlBar';
import SlideDeck, { type SlideDeckHandle } from '../slides/SlideDeck';
import { colors } from '../../theme/colors';

/** Total interval between slide transitions in milliseconds */
const TOTAL_INTERVAL = 2500;

/**
 * Dashboard component that manages and displays slide groups.
 *
 * Navigation, auto-advance, keyboard arrows, and transitions are all owned
 * by reveal.js (via SlideDeck). Dashboard only handles:
 * - Control-bar visibility (Escape + menu button)
 * - Pause toggle (Space) — freezes auto-advance but keeps slide visible
 * - Jump-to-slide from the control bar
 */
const Dashboard: React.FC = () => {
  const { dashboard } = useConfig();
  const slideGroups = dashboard.slideGroups;

  const deckRef = useRef<SlideDeckHandle>(null);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [dashboardControlBarVisible, setDashboardControlBarVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { setAppControlBarVisible } = useContext(LayoutContext);

  const handleIndicesChange = useCallback((groupIndex: number, slideIndex: number) => {
    setActiveGroupIndex(groupIndex);
    setActiveSlideIndex(slideIndex);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const newState = !dashboardControlBarVisible;
        setAppControlBarVisible(newState);
        setDashboardControlBarVisible(newState);
      } else if (event.key === ' ') {
        event.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, [dashboardControlBarVisible, setAppControlBarVisible]);

  const handleControlBarSlideClick = (groupIndex: number, slideIndex: number) => {
    deckRef.current?.goToSlide(groupIndex, slideIndex);
  };

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
        boxSizing: 'border-box',
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
          },
        }}
      >
        <Menu />
      </IconButton>

      <SlideDeck
        ref={deckRef}
        slideGroups={slideGroups}
        autoSlideMs={TOTAL_INTERVAL}
        paused={isPaused}
        onIndicesChange={handleIndicesChange}
      />

      <DashboardControlBar
        visible={dashboardControlBarVisible}
        onClose={() => {
          setAppControlBarVisible(false);
          setDashboardControlBarVisible(false);
        }}
        slideGroups={slideGroups}
        visibleColorIndex={activeGroupIndex % colors.length}
        activeSlideIndex={activeSlideIndex}
        onSlideClick={handleControlBarSlideClick}
        isPaused={isPaused}
        onPauseChange={setIsPaused}
      />
    </Box>
  );
};

export default Dashboard;
