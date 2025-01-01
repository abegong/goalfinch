import React, { useState } from 'react';
import { slideData, Slide, Captions } from '../data/slide_data';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import SlideConfig, { getSlideIcon } from './SlideConfig';

const Goals: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(slideData);

  const handleSlideChange = (index: number, newConfig: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...newConfig };
    setSlides(newSlides);
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
    return formatSlideType(slide.type);
  };

  return (
    <Timeline
      sx={{
        [`& .MuiTimelineItem-root`]: {
          minHeight: 'auto',
        },
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: '0 0 150px',
          maxWidth: '150px',
          padding: '16px 8px',
          marginTop: 0,
          marginBottom: 0
        },
      }}
    >
      {slides.map((slide, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent>
            <Typography variant="body2" color="text.secondary">
              {getSlideName(slide)}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ p: 0 }}>
              {getSlideIcon(slide.type)}
            </TimelineDot>
            {index < slides.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
              <CardContent>
                <SlideConfig
                  {...slide}
                  onChange={(newConfig) => handleSlideChange(index, newConfig)}
                />
              </CardContent>
            </Card>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default Goals;
