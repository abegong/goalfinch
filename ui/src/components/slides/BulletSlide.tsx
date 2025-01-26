import React from 'react';
import Slide from './Slide';
import { BulletSlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig } from '../../types/slides';

interface BulletSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideConfig: BulletSlideConfig;
}

const BulletSlide: React.FC<BulletSlideProps> = ({ slideConfig, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
    >
      <div style={{ 
        position: 'absolute',
        left: '25%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '75%'
      }}>
        <ul style={{
          padding: 0,
          margin: 0,
          listStyleType: 'square',
        }}>
          {slideConfig.content.map((item: string, index: number) => (
            <li 
              key={index}
              style={{
                fontSize: '3rem',
                color: 'rgba(235, 235, 235, 0.85)',
                marginBottom: '1rem',
                textAlign: 'left'
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Slide>
  );
};

export default BulletSlide;
