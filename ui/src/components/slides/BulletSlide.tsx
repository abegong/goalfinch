import React from 'react';
import Slide from './Slide';
import { BulletSlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig } from '../../types/slides';
import { Box } from '@mui/material';

interface BulletSlideProps extends Omit<React.ComponentProps<typeof Slide>, 'text'> {
  slideConfig: BulletSlideConfig;
}

const BulletSlide: React.FC<BulletSlideProps> = ({ slideConfig, ...slideProps }) => {
  return (
    <Slide
      {...slideProps}
      text=""
    >
      <Box sx={{ 
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
                color: 'rgba(235, 235, 235, 0.90)',
                marginBottom: '1rem',
                textAlign: 'left'
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </Box>
    </Slide>
  );
};

export default BulletSlide;
