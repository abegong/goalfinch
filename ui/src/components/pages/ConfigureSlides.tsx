import React, { useState, useCallback } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSlides } from '../../context/SlideContext';
import { BaseSlide } from '../../data/BaseSlide';
import { Slide, SlideType } from '../../data/slide_interfaces';
import SlideGroupTimelineItem from '../SlideGroupTimelineItem';

const ConfigureSlides: React.FC = () => {
  const { slides, setSlides } = useSlides();
  const [expandedItems, setExpandedItems] = useState<boolean[]>([]);

  const handleSlideChange = (index: number, newConfig: Partial<Slide>) => {
    const newSlides = [...slides];
    const currentSlide = newSlides[index];
    // Preserve the getName method from the current slide
    newSlides[index] = { 
      ...currentSlide, 
      ...newConfig,
      getName: currentSlide.getName.bind(currentSlide)
    };
    setSlides(newSlides);
  };

  const handleSlideOrderChange = useCallback((newSlides: Slide[]) => {
    setSlides(newSlides);
  }, [setSlides]);

  const handleAddSlide = () => {
    const newSlide = new BaseSlide(SlideType.NESTED_IMAGES, undefined, {});
    const newSlides = [...slides, newSlide];
    handleSlideOrderChange(newSlides);
    
    // Update expanded and animating states
    setExpandedItems([...expandedItems, false]);
  };

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems(prevExpandedItems => {
      const newExpandedItems = [...prevExpandedItems];
      newExpandedItems[index] = !newExpandedItems[index];
      return newExpandedItems;
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;

    const newSlides = [...slides];
    const [removed] = newSlides.splice(sourceIndex, 1);
    newSlides.splice(targetIndex, 0, removed);
    handleSlideOrderChange(newSlides);

    // Update expanded and animating states to match new order
    const newExpandedItems = [...expandedItems];
    const [removedExpanded] = newExpandedItems.splice(sourceIndex, 1);
    newExpandedItems.splice(targetIndex, 0, removedExpanded);
    setExpandedItems(newExpandedItems);
  };

  const handleSlideDelete = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    handleSlideOrderChange(newSlides);
    
    // Update expanded and animating states to match new array length
    const newExpandedItems = [...expandedItems];
    newExpandedItems.splice(index, 1);
    
    setExpandedItems(newExpandedItems);
  };

  return (
    <Timeline
      sx={{
        left: "0px",
        marginLeft: "-200px",
        [`& .${timelineOppositeContentClasses.root}`]: {
          width: '240px',
          maxWidth: '240px',
          padding: '8px 8px',
          marginTop: 0,
          marginBottom: 0
        },
        [`& .MuiTimelineItem-root`]: {
          minHeight: '80px',
          '&:hover': {
            '& .timeline-text:not(:empty)': {
              backgroundColor: 'primary.light',
              color: 'common.white'
            },
            '& .MuiTimelineDot-root': {
              transform: 'scale(1.1)',
              backgroundColor: 'primary.light'
            },
            '& .MuiTimelineConnector-root': {
              backgroundColor: 'primary.light'
            }
          }
        },
        [`& .${TimelineOppositeContent}`]: {
          flex: '0 0 150px',
          maxWidth: '150px',
          padding: '8px 8px',
          marginTop: 0,
          marginBottom: 0
        },
      }}
    >
      {slides.map((slide, index) => (
        <SlideGroupTimelineItem
          key={index}
          slide={slide}
          index={index}
          slides={slides}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onSlideChange={handleSlideChange}
          onDelete={handleSlideDelete}
        />
      ))}
      <TimelineItem>
        <TimelineOppositeContent />
        <TimelineSeparator>
          <TimelineDot
            sx={{
              p: 0,
              borderRadius: '6px',
              width: '50px',
              height: '50px',
              justifyContent: 'center',
              backgroundColor: 'primary.main',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'primary.dark'
              }
            }}
            onClick={handleAddSlide}
          >
            <Box sx={{
              fontSize: '42px',
              '& > svg': {
                width: '42px',
                height: '42px'
              }
            }}>
              <Add />
            </Box>
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent />
      </TimelineItem>
    </Timeline>
  );
};

export default ConfigureSlides;
