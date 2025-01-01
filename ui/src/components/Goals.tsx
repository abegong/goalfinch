import React, { useState } from 'react';
import { slideData, Slide } from '../data/slide_data';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import SlideConfig from './SlideConfig';

const Goals: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(slideData);

  const handleSlideChange = (index: number, newConfig: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], ...newConfig };
    setSlides(newSlides);
  };

  return (
    <Timeline
      sx={{
        [`& .MuiTimelineItem-root`]: {
          minHeight: 'auto',
        },
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.0,
        },
      }}
    >
      {slides.map((slide, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent>
            <Typography variant="body2" color="text.secondary">
              {new Date('2025-01-01T15:45:48-07:00').toLocaleDateString()}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            {index < slides.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
              <CardHeader
                title={`Slide ${index + 1}`}
                titleTypography={{ variant: 'subtitle1' }}
                sx={{ pb: 1 }}
              />
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
