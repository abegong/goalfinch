import React from 'react';
import { type SlideGroupConfig } from '../../types/slide_groups';
import {
  type SlideConfig,
  SlideType,
} from '../../types/slides';
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
  const today = new Date().toISOString().split('T')[0];
  const str = `${today}-${groupIndex}-${slideIndex}`;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const positiveHash = Math.abs(hash);
  return colors[positiveHash % colors.length];
};

interface SlideGroupProps {
  config: SlideGroupConfig;
  slideGroupIndex: number;
}

const renderSlideContent = (
  slideConfig: SlideConfig,
  groupIndex: number,
  slideIndex: number,
  totalSlides: number,
  captions: SlideGroupConfig['captions'],
) => {
  const commonProps = {
    index: slideIndex,
    captions,
    text: `${slideIndex + 1}/${totalSlides}`,
    backgroundColor: getHashedColor(slideIndex, groupIndex).hex,
  };

  switch (slideConfig.type) {
    case SlideType.BULLETS:
      return (
        <BulletSlide {...commonProps} slideConfig={slideConfig} />
      );
    case SlideType.CHART:
      return (
        <ChartSlide {...commonProps} slideConfig={slideConfig} />
      );
    case SlideType.PICTURE:
      return (
        <PictureSlide
          {...commonProps}
          slideConfig={slideConfig}
          backgroundImage={
            'http://goal-finch.s3-website-us-east-1.amazonaws.com/cool-backgrounds/cool-background%20(3).png'
          }
        />
      );
    default:
      return null;
  }
};

/**
 * SlideGroup renders a slide group as a reveal.js horizontal <section>
 * containing one nested <section> per slide. Navigation (left/right between
 * groups, up/down within a group) and transitions are owned by reveal.js.
 *
 * Each nested <section> gets a deterministic per-day background color and
 * an overlay of group captions.
 */
const SlideGroup: React.FC<SlideGroupProps> = ({ config, slideGroupIndex }) => {
  const totalSlides = config.slides.length;

  return (
    <section>
      {config.slides.map((slideConfig, slideIndex) => (
        <section
          key={slideIndex}
          style={{
            backgroundColor: getHashedColor(slideIndex, slideGroupIndex).hex,
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {renderSlideContent(
            slideConfig,
            slideGroupIndex,
            slideIndex,
            totalSlides,
            config.captions,
          )}
          <SlideGroupCaptions captions={config.captions} />
        </section>
      ))}
    </section>
  );
};

export default SlideGroup;
