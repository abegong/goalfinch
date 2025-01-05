import React, { useState, useCallback, useEffect } from 'react';
import { Card, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { SlideGroupConfig, BaseSlideGroupConfig } from '../../types/slide_groups';
import { SlideType, SlideConfig } from '../../types/slides';
import BulletListSlide from './BulletListSlide';
import ChartSlide from './ChartSlide';
import GallerySlide from './GallerySlide';

interface SlideGroupProps {
  config: SlideGroupConfig;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
}

const SlideGroup: React.FC<SlideGroupProps> = ({
  config,
  autoAdvance = false,
  autoAdvanceInterval = 5000,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const totalSlides = 'slides' in config ? config.slides.length : config.slide_count;
  const animationDuration = 500; // ms

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    setDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
    }, animationDuration);
  }, [isTransitioning, totalSlides]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsTransitioning(false);
    }, animationDuration);
  }, [isTransitioning, totalSlides]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (autoAdvance && totalSlides > 1) {
      intervalId = setInterval(goToNextSlide, autoAdvanceInterval);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoAdvance, autoAdvanceInterval, goToNextSlide, totalSlides]);

  const renderSlide = () => {
    if (!('slides' in config)) {
      return <GallerySlide 
        isTransitioning={isTransitioning}
        animationDuration={animationDuration}
        direction={direction}
        slideGroup={config}
      />;
    }

    const currentSlide = config.slides[currentSlideIndex];
    const commonProps = {
      isTransitioning,
      animationDuration,
      direction,
    };

    switch (config.type) {
      case SlideType.BULLETS:
        return <BulletListSlide {...commonProps} slideGroup={config} />;
      case SlideType.CHART:
        return <ChartSlide {...commonProps} slideGroup={config} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      {renderSlide()}
      
      {totalSlides > 1 && (
        <>
          <IconButton
            onClick={goToPrevSlide}
            disabled={isTransitioning}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={goToNextSlide}
            disabled={isTransitioning}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            <ChevronRight />
          </IconButton>
        </>
      )}
    </Card>
  );
};

export default SlideGroup;
