import React from 'react';
import { slideData } from '../data/slide_data';
import ReactJson from 'react-json-view';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';

const Goals: React.FC = () => {
  return (
      <Timeline
        sx={{
          // ml: '50px',
          // position: 'relative',
          [`& .MuiTimelineItem-root`]: {
            minHeight: 'auto',
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.0,
          },
        }}
      >
        {slideData.map((slide, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent>
              <Typography variant="body2" color="text.secondary">
                {new Date('2025-01-01T15:27:51-07:00').toLocaleDateString()}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot />
              {index < slideData.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
                <CardHeader
                  title={`Slide ${index + 1}`}
                  titleTypography={{ variant: 'subtitle1' }}
                  sx={{ pb: 1 }}
                />
                <CardContent>
                  <ReactJson 
                    src={slide}
                    theme="summerfruit:inverted"
                    collapsed={2}
                    displayDataTypes={false}
                    enableClipboard={false}
                    style={{
                      backgroundColor: 'transparent',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}
                  />
                  {slide.captions && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Captions:
                      </Typography>
                      {Object.entries(slide.captions).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <Typography variant="body2" color="text.secondary">
                            {key.replace('_', ' ')}:
                          </Typography>
                          <Typography variant="body2">
                            {value as string}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
  );
};

export default Goals;
