import React from 'react';
import Slide from './Slide';
import { BulletListSlide as BulletListSlideType } from '../../data/slide_interfaces';

interface BulletListSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slide: BulletListSlideType;
}

const BulletListSlide: React.FC<BulletListSlideProps> = ({ slide, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
      captions={slide.captions}
    >
      <div style={{ 
        padding: '48px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <ul style={{
          position: 'relative',
          left: '25%',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {slide.content?.map((item: string, index: number) => (
            <li 
              key={index}
              style={{
                fontSize: '2.0rem',
                color: 'rgb(255, 255, 255, 0.9)',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'white',
                borderRadius: '50%',
                display: 'inline-block'
              }}/>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Slide>
  );
};

export default BulletListSlide;
