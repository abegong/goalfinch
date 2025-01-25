import React from 'react';
import Slide from './Slide';
import { ChartSlideGroupConfig } from '../../types/slide_groups';
import { ChartSlideConfig } from '../../types/slides';

interface ChartSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideConfig: ChartSlideConfig;
}

const ChartSlide: React.FC<any> = ({ slideConfig, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text={slideProps.text}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Chart content will go here */}
      </div>
    </Slide>
  );
};

export default ChartSlide;
