import React from 'react';
import { slideData } from '../data/slide_data';
import ReactJson from 'react-json-view';
import { Card, CardContent, CardHeader, Typography, Stack } from '@mui/material';

const Goals: React.FC = () => {
  return (
    <div className="p-4">
      <Typography variant="h4" component="h1" gutterBottom>
        Goals
      </Typography>
      <Stack spacing={3}>
        {slideData.map((slide, index) => (
          <Card key={index} elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
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
        ))}
      </Stack>
    </div>
  );
};

export default Goals;
