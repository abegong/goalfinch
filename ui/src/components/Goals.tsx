import React, { useState, useCallback } from 'react';
import { Slide, SlideType } from '../data/slide_interfaces';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Card, CardContent, Typography, Box } from '@mui/material';
import SlideConfig, { getSlideIcon } from './SlideConfig';
import { Add } from '@mui/icons-material';
import { useSlides } from '../context/SlideContext';
import { BaseSlide } from '../data/BaseSlide';


const Goals: React.FC = () => {
  const { slides, setSlides } = useSlides();
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(slides.length).fill(false));
  const [animatingItems, setAnimatingItems] = useState<boolean[]>(new Array(slides.length).fill(false));

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
    setAnimatingItems([...animatingItems, false]);
  };

  const toggleExpanded = (index: number) => {
    if (animatingItems[index]) return; // Prevent toggling while animating

    const newExpandedItems = [...expandedItems];
    const newAnimatingItems = [...animatingItems];
    
    if (expandedItems[index]) {
      // Start collapsing animation
      newExpandedItems[index] = false;
      // newAnimatingItems[index] = true;
    } else {
      // Immediately show and start expanding animation
      newExpandedItems[index] = true;
      // newAnimatingItems[index] = true;
    }

    setExpandedItems(newExpandedItems);
    setAnimatingItems(newAnimatingItems);
};

  const handleTransitionEnd = (index: number) => {
    const newExpandedItems = [...expandedItems];
    const newAnimatingItems = [...animatingItems];
    
    if (!expandedItems[index]) {
      // If we were collapsing, now remove the component
      newExpandedItems[index] = false;
    }
    
    newAnimatingItems[index] = false;
    setExpandedItems(newExpandedItems);
    setAnimatingItems(newAnimatingItems);
  };

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
    const newAnimatingItems = [...animatingItems];
    const [removedExpanded] = newExpandedItems.splice(sourceIndex, 1);
    const [removedAnimating] = newAnimatingItems.splice(sourceIndex, 1);
    newExpandedItems.splice(targetIndex, 0, removedExpanded);
    newAnimatingItems.splice(targetIndex, 0, removedAnimating);
    setExpandedItems(newExpandedItems);
    setAnimatingItems(newAnimatingItems);
  };

  const handleSlideDelete = (index: number) => {
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    handleSlideOrderChange(newSlides);
    
    // Update expanded and animating states to match new array length
    const newExpandedItems = [...expandedItems];
    const newAnimatingItems = [...animatingItems];
    newExpandedItems.splice(index, 1);
    newAnimatingItems.splice(index, 1);
    
    setExpandedItems(newExpandedItems);
    setAnimatingItems(newAnimatingItems);
  };

  return (
    <Timeline
      sx={{
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
        <TimelineItem 
          key={index}
          sx={{ cursor: 'default' }}
        >
          <TimelineOppositeContent
            onClick={() => toggleExpanded(index)}
            sx={{ cursor: 'pointer' }}
          >
            {slide.getName && (
              <Typography 
                variant="body2" 
                color="text.secondary"
                className="timeline-text"
                sx={{
                  display: 'inline-block',
                  margin: '1px -24px 0px 0px',
                  padding: '8px 32px 8px 12px',
                  borderRadius: '16px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s, color 0.2s'
                }}
              >
                {slide.getName()}
              </Typography>
            )}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot 
              draggable
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(index);
              }}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              sx={{ 
                cursor: 'pointer',
                p: 0,
                borderRadius: '6px',
                width: '50px',
                height: '50px',
                justifyContent: 'center',
                transition: 'transform 0.2s, background-color 0.2s',
                backgroundColor: 'text.secondary',
                '&:active': {
                  cursor: 'grabbing'
                }
              }}
            >
              <Box sx={{ 
                fontSize: '42px',
                '& > svg': {
                  width: '42px',
                  height: '42px'
                }
              }}>
                {getSlideIcon(slide.type)}
              </Box>
            </TimelineDot>
            {index < slides.length - 1 && (
              <TimelineConnector 
                sx={{ 
                  transition: 'background-color 0.2s',
                  width: '4px',
                  //rounded edges
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  borderBottomRightRadius: '4px',
                  borderBottomLeftRadius: '4px'
                }}
              />
            )}
          </TimelineSeparator>
          <TimelineContent>
            {expandedItems[index] && (
              <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
                <CardContent>
                  <SlideConfig
                    {...slide}
                    onChange={(newConfig) => handleSlideChange(index, newConfig)}
                    onTransitionEnd={() => handleTransitionEnd(index)}
                    onDelete={() => handleSlideDelete(index)}
                  />
                </CardContent>
              </Card>
            )}
          </TimelineContent>
        </TimelineItem>
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

export default Goals;
