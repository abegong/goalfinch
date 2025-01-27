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

  const getTransforms = () => {
    const offScreenStart = direction === 'left' ? 100 : -100;
    const offScreenEnd = direction === 'left' ? -100 : 100;

    return {
      current: {
        initial: 'translateX(0%)',
        final: `translateX(${offScreenEnd}%)`
      },
      next: {
        initial: `translateX(${offScreenStart}%)`,
        final: 'translateX(0%)'
      }
    };
  };

  const transforms = getTransforms();

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden'
    }}>
      {/* Current Slide */}
      <Box sx={{ 
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: isTransitioning ? transforms.current.final : transforms.current.initial,
        transition: `transform ${animationDuration}ms ease-in-out`,
        zIndex: 1
      }}>
        <SlideGroup
          key={`current-${currentSlideGroupIndex}-${currentSlideIndex}`}
          config={config}
          currentSlideIndex={currentSlideIndex}
        />
      </Box>

      {/* Next Slide */}
      <Box sx={{ 
        position: 'absolute',
        width: '100%',
        height: '100%',
        transform: isTransitioning ? transforms.next.final : transforms.next.initial,
        transition: `transform ${animationDuration}ms ease-in-out`,
        zIndex: 2
      }}>
        <SlideGroup
          key={`next-${nextSlideGroupIndex}-${nextSlideIndex}`}
          config={config}
          currentSlideIndex={nextSlideIndex}
        />
      </Box>
    </Box>
  );
};

export default SlideTransition;
