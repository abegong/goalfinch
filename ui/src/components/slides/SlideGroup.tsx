import React, { useState, useCallback, useEffect } from 'react';
import { Card, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { SlideGroupConfig, BaseSlideGroupConfig } from '../../types/slide_groups';
import { SlideType, SlideConfig } from '../../types/slides';
import BulletListSlide from './BulletListSlide';
import ChartSlide from './ChartSlide';
import PictureSlide from './GallerySlide';

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

  const totalSlides = config.slides.length;
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
      return <PictureSlide
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

    // switch (config.type) {
    //   case SlideType.CHART:
    //     return <ChartSlideGroup slide={config} {...props} />;
    //   case SlideType.PICTURE:
    //     return <PictureSlideGroup
    //       slide={config}
    //       backgroundImage={"http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png"}
    //       {...props}
    //     />;
    //   case SlideType.BULLETS:
    //     return <BulletListSlideGroup slide={config} {...props} />;
    // }
    switch (config.type) {
      case SlideType.BULLETS:
        return <BulletListSlide {...commonProps} slideGroup={config} />;

      case SlideType.CHART:
        return <ChartSlide {...commonProps} slideGroup={config} />;

      case SlideType.PICTURE:
        return <PictureSlide
          slideGroup={config}
          backgroundImage={"http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png"}
          {...commonProps}
        />;  
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
      
      {/* {totalSlides > 1 && (
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
      )} */}
    </Card>
  );
};

export default SlideGroup;
