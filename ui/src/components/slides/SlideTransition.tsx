import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';
import { SlideGroupConfig } from '../../types/slide_groups';
import SlideGroup from './SlideGroup';

interface SlideTransitionProps {
  config: SlideGroupConfig;
  currentSlideIndex: number;
  currentSlideGroupIndex: number;
  incomingSlideIndex: number;
  incomingSlideGroupIndex: number;
  direction: 'left' | 'right' | 'up' | 'down';
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

/**
 * Handles the animation of transitioning between slides using Framer Motion.
 * Uses AnimatePresence to handle enter/exit animations automatically when the key changes.
 * 
 * Slide movement directions:
 * - 'left': Slides move left (current exits left, new enters from right)
 * - 'right': Slides move right (current exits right, new enters from left)
 * - 'up': Slides move up (current exits up, new enters from bottom)
 * - 'down': Slides move down (current exits down, new enters from top)
 */
const SlideTransition: React.FC<SlideTransitionProps> = ({
  config,
  currentSlideIndex,
  currentSlideGroupIndex,
  direction,
  onTransitionStart,
  onTransitionEnd,
}) => {
  const getVariants = () => {
    const offset = 100;
    
    // For each direction, define enter/exit positions
    const variants = {
      left: {
        enter: { x: '100%', y: 0 },
        center: { x: 0, y: 0 },
        exit: { x: '-100%', y: 0 }
      },
      right: {
        enter: { x: '-100%', y: 0 },
        center: { x: 0, y: 0 },
        exit: { x: '100%', y: 0 }
      },
      up: {
        enter: { x: 0, y: '100%' },
        center: { x: 0, y: 0 },
        exit: { x: 0, y: '-100%' }
      },
      down: {
        enter: { x: 0, y: '-100%' },
        center: { x: 0, y: 0 },
        exit: { x: 0, y: '100%' }
      }
    };

    return variants[direction];
  };

  const transition = {
    duration: 0.5,
    ease: [0.4, 0.0, 0.2, 1],
    onStart: onTransitionStart,
    onComplete: onTransitionEnd,
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={`${currentSlideGroupIndex}-${currentSlideIndex}`}
          initial="enter"
          animate="center"
          exit="exit"
          variants={getVariants()}
          transition={transition}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <SlideGroup
            config={config}
            currentSlideIndex={currentSlideIndex}
            currentSlideGroupIndex={currentSlideGroupIndex}
            sx={{ height: '100%' }}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default SlideTransition;
