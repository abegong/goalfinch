import React, { useState, useCallback, useEffect } from 'react';
import { Card, IconButton, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { SlideGroupConfig, BaseSlideGroupConfig, Captions } from '../../types/slide_groups';
import { SlideType, SlideConfig, BulletSlideConfig, ChartSlideConfig, PictureSlideConfig } from '../../types/slides';
import BulletSlide from './BulletSlide';
import ChartSlide from './ChartSlide';
import PictureSlide from './PictureSlide';
import SlideGroupCaptions from './SlideGroupCaptions';
import { Typography } from '@mui/material';

interface SlideGroupProps {
  config: SlideGroupConfig;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  initialSlideIndex?: number;
}

const SlideGroup: React.FC<SlideGroupProps> = ({
  config,
  autoAdvance = false,
  autoAdvanceInterval = 5000,
  initialSlideIndex = 0,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
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

  useEffect(() => {
    if (currentSlideIndex !== initialSlideIndex) {
      setDirection(initialSlideIndex > currentSlideIndex ? 'right' : 'left');
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlideIndex(initialSlideIndex);
        setIsTransitioning(false);
      }, animationDuration);
    }
  }, [initialSlideIndex, currentSlideIndex, animationDuration]);

  const renderSlide = (slideConfig: SlideConfig, index: number) => {
    // if (!('slides' in config)) {
    //   return <PictureSlide
    //     isTransitioning={isTransitioning}
    //     animationDuration={animationDuration}
    //     direction={direction}
    //     slideGroup={config}
    //   />;
    // }

    const currentSlide = config.slides[currentSlideIndex];
    const commonProps = {
      index: currentSlideIndex,
      captions: config.captions,
      text: `${currentSlideIndex + 1}/${totalSlides}`,
      isTransitioning,
      animationDuration,
      direction,
    };

    switch (config.type) {
      case SlideType.BULLETS:
        return <BulletSlide {...commonProps} slideConfig={slideConfig as BulletSlideConfig} />;

      case SlideType.CHART:
        return <ChartSlide {...commonProps} slideConfig={slideConfig as ChartSlideConfig} />;

      case SlideType.PICTURE:
        return <PictureSlide
          slideConfig={slideConfig as PictureSlideConfig}
          backgroundImage={"http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png"}
          {...commonProps}
        />;  
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Iterate over slides */}
      {config.slides?.map((slide, index) => (
        <React.Fragment key={index}>
          {renderSlide(slide, index)}
        </React.Fragment>
      ))}
      <SlideGroupCaptions captions={config.captions} />
    </Box>
  );
};

export default SlideGroup;
