import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import SlideGroup from './SlideGroup';

interface SlideTransitionProps {
  config: SlideGroupConfig;
  currentSlideIndex: number;
  currentSlideGroupIndex: number;
  incomingSlideIndex: number;
  incomingSlideGroupIndex: number;
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
  incomingSlideIndex,
  incomingSlideGroupIndex,
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
    const offScreenStart = direction === 'left' ? 100 : direction === 'right' ? -100 : direction === 'up' ? 100 : -100;
    const offScreenEnd = direction === 'left' ? -100 : direction === 'right' ? 100 : direction === 'up' ? -100 : 100;
    const translateProp = direction === 'left' || direction === 'right' ? 'X' : 'Y';

    return {
      outgoing: {
        initial: `translate${translateProp}(0%)`,
        final: `translate${translateProp}(${offScreenEnd}%)`
      },
      incoming: {
        initial: `translate${translateProp}(${offScreenStart}%)`,
        final: `translate${translateProp}(0%)`
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
      {isTransitioning ? (
        <>
          {/* Outgoing Slide */}
          <Box sx={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: transforms.outgoing.final,
            transition: `transform ${animationDuration}ms ease-in-out`,
            zIndex: 1
          }}>
            <SlideGroup
              key={`${currentSlideGroupIndex}-${currentSlideIndex}`}
              config={config}
              currentSlideIndex={currentSlideIndex}
              currentSlideGroupIndex={currentSlideGroupIndex}
              sx={{ height: '100%' }}
            />
          </Box>

          {/* Incoming Slide */}
          <Box sx={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: transforms.incoming.final,
            transition: `transform ${animationDuration}ms ease-in-out`,
            zIndex: 1
          }}>
            <SlideGroup
              key={`${incomingSlideGroupIndex}-${incomingSlideIndex}`}
              config={config}
              currentSlideIndex={incomingSlideIndex}
              currentSlideGroupIndex={incomingSlideGroupIndex}
              sx={{ height: '100%' }}
            />
          </Box>
        </>
      ) : (
        /* Single slide when not transitioning */
        <Box sx={{ 
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: transforms.outgoing.initial,
          transition: `transform ${animationDuration}ms ease-in-out`,
          zIndex: 1
        }}>
          <SlideGroup
            key={`${currentSlideGroupIndex}-${currentSlideIndex}`}
            config={config}
            currentSlideIndex={currentSlideIndex}
            currentSlideGroupIndex={currentSlideGroupIndex}
            sx={{ height: '100%' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SlideTransition;
