import React from 'react';
import Slide from './Slide';
import { ChartSlideGroupConfig } from '../../types/slide_groups';
import { ChartSlideConfig } from '../../types/slides';

interface ChartSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideConfig: ChartSlideConfig;
}

const ChartSlide: React.FC<ChartSlideProps> = ({ slideConfig, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
      // text={`${slideGroup.slides[0].content.goal}${slideGroup.slides[0].content.units}`}
      // captions={slideGroup.captions}
    >
      {/* TODO: Add chart visualization component here */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Chart content will go here */}
      </div>
    </Slide>
  );
};

export default ChartSlide;
