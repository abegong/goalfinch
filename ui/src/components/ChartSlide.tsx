import React from 'react';
import Slide from './Slide';
import { ChartSlide as ChartSlideType } from '../data/slide_interfaces';

interface ChartSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slide: ChartSlideType;
}

const ChartSlide: React.FC<ChartSlideProps> = ({ slide, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text={`${slide.goal}${slide.units}`}
      captions={slide.captions}
    >
      {/* TODO: Add chart visualization component here */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Chart content will go here */}
      </div>
    </Slide>
  );
};

export default ChartSlide;
