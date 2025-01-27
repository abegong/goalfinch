import React from 'react';
import { Card } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig, ChartSlideConfig, PictureSlideConfig, SlideConfig, SlideType } from '../../types/slides';
import BulletSlide from './BulletSlide';
import ChartSlide from './ChartSlide';
import PictureSlide from './PictureSlide';
import SlideGroupCaptions from './SlideGroupCaptions';

interface SlideGroupProps {
  config: SlideGroupConfig;
  currentSlideIndex: number;
  isTransitioning?: boolean;
  direction?: 'left' | 'right' | 'up' | 'down';
  animationDuration?: number;
  isOutgoing?: boolean;
}

const SlideGroup: React.FC<SlideGroupProps> = ({
  config,
  currentSlideIndex,
  isTransitioning = false,
  direction = 'right',
  animationDuration = 500,
  isOutgoing = false,
}) => {
  const totalSlides = config.slides.length;
  const currentSlide = config.slides[currentSlideIndex];

  const renderSlide = (slideConfig: SlideConfig | undefined) => {
    if (!slideConfig) return null;

    const commonProps = {
      index: currentSlideIndex,
      captions: config.captions,
      text: `${currentSlideIndex + 1}/${totalSlides}`,
      isTransitioning,
      isOutgoing,
      animationDuration,
      direction,
    };

    switch (slideConfig.type) {
      case SlideType.BULLETS:
        return <BulletSlide {...commonProps} slideConfig={slideConfig as BulletSlideConfig} />;
      case SlideType.CHART:
        return <ChartSlide {...commonProps} slideConfig={slideConfig as ChartSlideConfig} />;
      case SlideType.PICTURE:
        return <PictureSlide
          {...commonProps}
          slideConfig={slideConfig as PictureSlideConfig}
          backgroundImage={"http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png"}
        />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ width: '100%', height: '100%', position: 'relative' }}>
      {renderSlide(currentSlide)}
      <SlideGroupCaptions captions={config.captions} />
    </Card>
  );
};

export default SlideGroup;
