import React from 'react';
import Slide from './Slide';
import { NestedImagesSlide } from '../../data/slide_interfaces';

interface GallerySlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slide: NestedImagesSlide;
  backgroundImage?: string;
}

const GallerySlide: React.FC<GallerySlideProps> = ({ slide, backgroundImage, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
      captions={slide.captions}
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
        {slide.content?.map((imageUrl: string, index: number) => (
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
        ))}
      </div>
    </Slide>
  );
};

export default GallerySlide;
