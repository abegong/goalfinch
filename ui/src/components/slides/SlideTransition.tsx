import React, { useState, useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import SlideGroup from './SlideGroup';

interface SlideTransitionProps {
  config: SlideGroupConfig;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  initialSlideIndex?: number;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

const SlideTransition: React.FC<SlideTransitionProps> = ({
  config,
  autoAdvance = false,
  autoAdvanceInterval = 5000,
  initialSlideIndex = 0,
  onTransitionStart,
  onTransitionEnd,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');

  const totalSlides = config.slides.length;
  const animationDuration = 500; // ms

  const goToNextSlide = useCallback(() => {
    if (isTransitioning || totalSlides <= 1) return;
    
    const nextIndex = (currentSlideIndex + 1) % totalSlides;
    if (nextIndex === currentSlideIndex) return;  // Don't transition if we're staying on the same slide
    
    setDirection('right');
    setIsTransitioning(true);
    onTransitionStart?.();
    
    setTimeout(() => {
      setCurrentSlideIndex(nextIndex);
      setIsTransitioning(false);
      onTransitionEnd?.();
    }, animationDuration);
  }, [isTransitioning, totalSlides, currentSlideIndex, animationDuration, onTransitionStart, onTransitionEnd]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning || totalSlides <= 1) return;
    
    const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    if (prevIndex === currentSlideIndex) return;  // Don't transition if we're staying on the same slide
    
    setDirection('left');
    setIsTransitioning(true);
    onTransitionStart?.();
    
    setTimeout(() => {
      setCurrentSlideIndex(prevIndex);
      setIsTransitioning(false);
      onTransitionEnd?.();
    }, animationDuration);
  }, [isTransitioning, totalSlides, currentSlideIndex, animationDuration, onTransitionStart, onTransitionEnd]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (autoAdvance && totalSlides > 1) {
      intervalId = setInterval(goToNextSlide, autoAdvanceInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoAdvance, autoAdvanceInterval, goToNextSlide, totalSlides]);

  useEffect(() => {
    if (currentSlideIndex !== initialSlideIndex) {
      const newDirection = initialSlideIndex > currentSlideIndex ? 'right' : 'left';
      setDirection(newDirection);
      setIsTransitioning(true);
      onTransitionStart?.();
      
      setTimeout(() => {
        setCurrentSlideIndex(initialSlideIndex);
        setIsTransitioning(false);
        onTransitionEnd?.();
      }, animationDuration);
    }
  }, [initialSlideIndex, currentSlideIndex, animationDuration, onTransitionStart, onTransitionEnd]);

  const nextSlideIndex = direction === 'left' ? 
    (currentSlideIndex - 1 + totalSlides) % totalSlides : 
    (currentSlideIndex + 1) % totalSlides;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'blue',
      }}
    >
      {isTransitioning && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <SlideGroup
            config={config}
            currentSlideIndex={currentSlideIndex}
            isTransitioning={isTransitioning}
            direction={direction}
            animationDuration={animationDuration}
            isOutgoing={true}
          />
        </Box>
      )}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: isTransitioning ? 2 : 1,
        }}
      >
        <SlideGroup
          config={config}
          currentSlideIndex={isTransitioning ? nextSlideIndex : currentSlideIndex}
          isTransitioning={isTransitioning}
          direction={direction}
          animationDuration={animationDuration}
        />
      </Box>
    </Box>
  );
};

export default SlideTransition;
