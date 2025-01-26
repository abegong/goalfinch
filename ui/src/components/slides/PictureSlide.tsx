import React from 'react';
import Slide from './Slide';
import { Captions, PictureSlideGroupConfig } from '../../types/slide_groups';
import { PictureSlideConfig } from '../../types/slides';
import { Box } from '@mui/material';

interface PictureSlideProps {
  slideConfig: PictureSlideConfig;
  index: number;
  captions?: Captions;
  text: string;
  isTransitioning: boolean;
  animationDuration: number;
  direction: 'left' | 'right' | 'up' | 'down';
  backgroundImage?: string;
}

const PictureSlide: React.FC<PictureSlideProps> = ({ slideConfig, text, backgroundImage, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text={text}
      backgroundColor="#000000"
      backgroundImage={backgroundImage}
    >
      <Box sx={{ 
        width: '100%',
        height: '100%',
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
      </Box>
    </Slide>
  );
};

export default PictureSlide;
