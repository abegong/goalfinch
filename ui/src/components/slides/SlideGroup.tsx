import React from 'react';
import { Card } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig, ChartSlideConfig, PictureSlideConfig, SlideConfig, SlideType } from '../../types/slides';
import BulletSlide from './BulletSlide';
import ChartSlide from './ChartSlide';
import PictureSlide from './PictureSlide';
import SlideGroupCaptions from './SlideGroupCaptions';
import { colors } from '../../theme/colors';

/**
 * Creates a deterministic hash from the slide index, group index and current date.
 * This ensures the same slide gets the same color on a given day, but colors change daily.
 */
const getHashedColor = (slideIndex: number, groupIndex: number) => {
  // Get today's date in YYYY-MM-DD format to use as a seed
  const today = new Date().toISOString().split('T')[0];
  
  // Create a string to hash
  const str = `${today}-${groupIndex}-${slideIndex}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value of hash to get a positive number
  const positiveHash = Math.abs(hash);
  
  // Use the hash to select a color
  return colors[positiveHash % colors.length];
};

interface SlideGroupProps {
  config: SlideGroupConfig;
  currentSlideIndex: number;
  currentSlideGroupIndex: number;
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
 *    - Applies a deterministic background color based on indices
 *    - Maintains consistent card-based layout
 *    - Supports custom styling via sx prop
 * 
 * 3. Captions:
 *    - Renders group-level captions using SlideGroupCaptions
 */
const SlideGroup: React.FC<SlideGroupProps> = ({
  config,
  currentSlideIndex,
  currentSlideGroupIndex,
  sx,
}) => {
  const totalSlides = config.slides.length;
  const currentSlide = config.slides[currentSlideIndex];

  const renderSlide = (slideConfig: SlideConfig | undefined) => {
    if (!slideConfig) return null;

    // Get a deterministic color based on indices
    const slideColor = getHashedColor(currentSlideIndex, currentSlideGroupIndex);

    const commonProps = {
      index: currentSlideIndex,
      captions: config.captions,
      text: `${currentSlideIndex + 1}/${totalSlides}`,
      backgroundColor: slideColor.hex,
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
