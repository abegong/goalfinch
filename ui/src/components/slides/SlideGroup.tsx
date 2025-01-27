import React from 'react';
import { Card } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig, ChartSlideConfig, PictureSlideConfig, SlideConfig, SlideType } from '../../types/slides';
import BulletSlide from './BulletSlide';
import ChartSlide from './ChartSlide';
import PictureSlide from './PictureSlide';
import SlideGroupCaptions from './SlideGroupCaptions';
import { colors } from '../../theme/colors';

interface SlideGroupProps {
  config: SlideGroupConfig;
  currentSlideIndex: number;
  sx?: any;
}

/**
 * SlideGroup renders a single slide with its captions based on the configuration.
 * 
 * Responsibilities:
 * 1. Slide Content:
 *    - Renders the appropriate slide type (Bullet, Chart, Picture)
 *    - Passes configuration to the specific slide component
 *    - Provides slide index information
 * 
 * 2. Visual Styling:
 *    - Applies a random background color from the theme
 *    - Maintains consistent card-based layout
 *    - Supports custom styling via sx prop
 * 
 * 3. Captions:
 *    - Renders group-level captions using SlideGroupCaptions
 */
const SlideGroup: React.FC<SlideGroupProps> = ({
  config,
  currentSlideIndex,
  sx,
}) => {
  const totalSlides = config.slides.length;
  const currentSlide = config.slides[currentSlideIndex];

  const renderSlide = (slideConfig: SlideConfig | undefined) => {
    if (!slideConfig) return null;

    // Get a random color from the colors array
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const commonProps = {
      index: currentSlideIndex,
      captions: config.captions,
      text: `${currentSlideIndex + 1}/${totalSlides}`,
      backgroundColor: randomColor.hex,
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
    <Card sx={{ width: '100%', height: '100%', position: 'relative', ...sx }}>
      {renderSlide(currentSlide)}
      <SlideGroupCaptions captions={config.captions} />
    </Card>
  );
};

export default SlideGroup;
