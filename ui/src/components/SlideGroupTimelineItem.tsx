import React from 'react';
import { TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Slide } from '../data/slide_interfaces';
import SlideGroupEditor, { getSlideIcon } from './editor/SlideGroupEditor';

interface SlideGroupTimelineItemProps {
  slide: Slide;
  index: number;
  slides: Slide[];
  expandedItems: boolean[];
  onToggleExpanded: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onSlideChange: (index: number, newConfig: Partial<Slide>) => void;
  onTransitionEnd: (index: number) => void;
  onDelete: (index: number) => void;
}

const SlideGroupTimelineItem: React.FC<SlideGroupTimelineItemProps> = ({
  slide,
  index,
  slides,
  expandedItems,
  onToggleExpanded,
  onDragStart,
  onDragOver,
  onDrop,
  onSlideChange,
  onTransitionEnd,
  onDelete,
}) => {
  return (
    <TimelineItem 
      key={index}
      sx={{ cursor: 'default' }}
    >
      <TimelineOppositeContent
        onClick={() => onToggleExpanded(index)}
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
            onToggleExpanded(index);
          }}
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, index)}
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
              <SlideGroupEditor
                {...slide}
                onChange={(newConfig) => onSlideChange(index, newConfig)}
                onTransitionEnd={() => onTransitionEnd(index)}
                onDelete={() => onDelete(index)}
              />
            </CardContent>
          </Card>
        )}
      </TimelineContent>
    </TimelineItem>
  );
};

export default SlideGroupTimelineItem;
