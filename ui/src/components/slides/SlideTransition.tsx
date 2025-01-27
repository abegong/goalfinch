import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import SlideGroup from './SlideGroup';

interface SlideTransitionProps {
  config: SlideGroupConfig;
  currentSlideIndex: number;
  currentSlideGroupIndex: number;
  nextSlideIndex: number;
  nextSlideGroupIndex: number;
  direction: 'left' | 'right' | 'up' | 'down';
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

/**
 * Handles the animation of transitioning between slides.
 * Supports both intra-group and inter-group transitions:
 * 
 * Within same group (currentSlideGroupIndex === nextSlideGroupIndex):
 * - direction='left': Current slide moves left, next slide enters from right
 * - direction='right': Current slide moves right, previous slide enters from left
 * 
 * Between groups:
 * - direction='up': Current slide moves up, next slide enters from bottom
 * - direction='down': Current slide moves down, next slide enters from top
 */
const SlideTransition: React.FC<SlideTransitionProps> = ({
  config,
  currentSlideIndex,
  currentSlideGroupIndex,
  nextSlideIndex,
  nextSlideGroupIndex,
  direction,
  onTransitionStart,
  onTransitionEnd,
}) => {
  const animationDuration = 500;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevSlideIndex = useRef(currentSlideIndex);
  const prevGroupIndex = useRef(currentSlideGroupIndex);

  // Start transition when either slide index or group changes
  useEffect(() => {
    const isNewSlide = currentSlideIndex !== prevSlideIndex.current;
    const isNewGroup = currentSlideGroupIndex !== prevGroupIndex.current;
    
    if (isNewSlide || isNewGroup) {
      setIsTransitioning(true);
      onTransitionStart?.();
      
      setTimeout(() => {
        setIsTransitioning(false);
        onTransitionEnd?.();
      }, animationDuration);

      prevSlideIndex.current = currentSlideIndex;
      prevGroupIndex.current = currentSlideGroupIndex;
    }
  }, [currentSlideIndex, currentSlideGroupIndex, animationDuration, onTransitionStart, onTransitionEnd]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <SlideGroup
        key={`current-${currentSlideGroupIndex}-${currentSlideIndex}`}
        config={config}
        currentSlideIndex={currentSlideIndex}
        isTransitioning={isTransitioning}
        direction={direction}
        isOutgoing={true}
        animationDuration={animationDuration}
      />
      {isTransitioning && (
        <SlideGroup
          key={`next-${nextSlideGroupIndex}-${nextSlideIndex}`}
          config={config}
          currentSlideIndex={nextSlideIndex}
          isTransitioning={isTransitioning}
          direction={direction}
          isOutgoing={false}
          animationDuration={animationDuration}
        />
      )}
    </Box>
  );
};

export default SlideTransition;
