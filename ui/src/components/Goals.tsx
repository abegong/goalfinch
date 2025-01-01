import React, { useState } from 'react';
import { slideData, Slide, Captions } from '../data/slide_data';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import SlideConfig, { getSlideIcon } from './SlideConfig';

const Goals: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(slideData);
  const [expandedItems, setExpandedItems] = useState<boolean[]>(new Array(slideData.length).fill(false));
  const [animatingItems, setAnimatingItems] = useState<boolean[]>(new Array(slideData.length).fill(false));

  const handleSlideChange = (index: number, newConfig: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...newConfig };
    setSlides(newSlides);
  };

  const toggleExpanded = (index: number) => {
    if (animatingItems[index]) return; // Prevent toggling while animating

    const newExpandedItems = [...expandedItems];
    const newAnimatingItems = [...animatingItems];
    
    if (expandedItems[index]) {
      // Start collapsing animation
      newAnimatingItems[index] = true;
      setAnimatingItems(newAnimatingItems);
    } else {
      // Immediately show and start expanding animation
      newExpandedItems[index] = true;
      newAnimatingItems[index] = true;
      setExpandedItems(newExpandedItems);
      setAnimatingItems(newAnimatingItems);
    }
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

  const formatSlideType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getSlideName = (slide: Slide) => {
    if (slide.captions) {
      // Check all caption fields in order of preference
      const captionFields: (keyof Captions)[] = ['top_center', 'bottom_center', 'bottom_right', 'bottom_left'];
      for (const field of captionFields) {
        if (slide.captions[field]) {
          return slide.captions[field];
        }
      }
    }
    return null; // Return empty string if no caption is found or slide has no caption
    //formatSlideType(slide.type);
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
        [`& .${timelineOppositeContentClasses.root}`]: {
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
          sx={{ cursor: 'pointer' }}
          onClick={() => toggleExpanded(index)}
        >
          <TimelineOppositeContent>
            {getSlideName(slide) && (
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
                {getSlideName(slide)}
              </Typography>
            )}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot 
              sx={{ 
                p: 0,
                borderRadius: '6px',
                width: '50px',
                height: '50px',
                justifyContent: 'center',
                transition: 'transform 0.2s, background-color 0.2s',
                backgroundColor: 'text.secondary'
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
                  />
                </CardContent>
              </Card>
            )}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default Goals;
