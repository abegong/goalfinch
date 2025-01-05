import React from 'react';
import Slide from './Slide';
import { BulletSlideGroupConfig } from '../../types/editors';

interface BulletListSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideGroup: BulletSlideGroupConfig;
}

const BulletSlide: React.FC<BulletListSlideProps> = ({ slideGroup, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
      // captions={slideGroup.captions}
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
          {/* {slideGroup.slides[0].content?.map((item: string, index: number) => (
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
          ))} */}
        </ul>
      </div>
    </Slide>
  );
};

export default BulletSlide;
