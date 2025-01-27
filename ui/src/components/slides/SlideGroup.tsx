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

/**
 * SlideGroup is responsible for rendering a single slide and managing its transition state.
 * 
 * Transition Behavior:
 * 1. Rendering:
 *    - Renders a single slide based on the currentSlideIndex
 *    - The slide is wrapped in a Card component that provides the base styling
 * 
 * 2. Transition State:
 *    - Receives isTransitioning and isOutgoing props from SlideTransition
 *    - These props are passed down to the individual Slide component
 *    - isOutgoing determines if this SlideGroup contains the slide that's leaving
 * 
 * 3. Animation Coordination:
 *    - Does not handle animations directly
 *    - Passes animation-related props to the Slide component:
 *      - direction: The direction of the transition
 *      - animationDuration: How long the transition should take
 *      - isTransitioning: Whether a transition is in progress
 *      - isOutgoing: Whether this slide is the one leaving
 * 
 * 4. Slide Content:
 *    - Maintains the slide content during the entire transition
 *    - Content should not change until the transition is complete
 *    - This ensures smooth transitions without content flashing
 */
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
