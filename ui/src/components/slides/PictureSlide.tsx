import React from 'react';
import Slide from './Slide';
import { PictureSlideGroupConfig } from '../../types/slide_groups';
import { PictureSlideConfig } from '../../types/slides';

interface PictureSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideConfig: PictureSlideConfig;
  backgroundImage?: string;
}

const PictureSlide: React.FC<PictureSlideProps> = ({ slideConfig, backgroundImage, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
      // captions={slideGroup.captions}
      backgroundColor="#000000"
      backgroundImage={backgroundImage}
    >
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        padding: '24px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {/* {slideGroup.slides[0].content?.map((imageUrl: string, index: number) => (
          <div 
            key={index}
            style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            <img 
              src={imageUrl} 
              alt={`Gallery item ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))} */}
      </div>
    </Slide>
  );
};

export default PictureSlide;
