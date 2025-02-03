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
 * Supports both intra-group and inter-group transitions:
 * 
 * Within same group (currentSlideGroupIndex === nextSlideGroupIndex):
 * - direction='left': Both slides move left (current exits left, incoming enters from right)
 * - direction='right': Both slides move right (current exits right, incoming enters from left)
 * 
 * Between groups:
 * - direction='up': Both slides move up (current exits up, incoming enters from bottom)
 * - direction='down': Both slides move down (current exits down, incoming enters from top)
 */
const SlideTransition: React.FC<SlideTransitionProps> = ({
  config,
  currentSlideIndex,
  currentSlideGroupIndex,
  incomingSlideIndex,
  incomingSlideGroupIndex,
  direction,
  onTransitionStart,
  onTransitionEnd,
}) => {
  const getVariants = () => {
    const offset = 100;
    
    // For each direction, both slides will move in that direction
    // e.g., for 'left', current slide moves from center(0) to -100%, incoming moves from +100% to center(0)
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
          initial="center"
          animate="exit"
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
        <motion.div
          key={`${incomingSlideGroupIndex}-${incomingSlideIndex}`}
          initial="enter"
          animate="center"
          exit="center"
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
            currentSlideIndex={incomingSlideIndex}
            currentSlideGroupIndex={incomingSlideGroupIndex}
            sx={{ height: '100%' }}
          />
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default SlideTransition;
