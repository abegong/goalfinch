import React from 'react';
import { TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent, TimelineOppositeContent } from '@mui/lab';
import { Typography, Box } from '@mui/material';
import { Slide, SlideType } from '../data/slide_interfaces';
import SlideGroupEditor, { getSlideIcon } from './editors/SlideGroupEditor';
import { SlideConfig } from './editors/slide_editor_types';

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
  onDelete,
}) => {
  const slideConfig: SlideConfig = {
    type: slide.type === SlideType.BULLET_LIST ? 'bullet' :
          slide.type === SlideType.CHART ? 'chart' :
          slide.type === SlideType.NESTED_CHARTS ? 'nested-charts' :
          'bullet',
    captions: slide.captions || { top_center: '', bottom_center: '' },
    ...(slide.type === SlideType.BULLET_LIST ? {
      content: slide.content || [],
    } : slide.type === SlideType.CHART ? {
      url: slide.url || '',
      goal: slide.goal || 0,
      rounding: slide.rounding || 0,
      units: slide.units || '',
    } : slide.type === SlideType.NESTED_CHARTS ? {
      content: slide.content || [],
    } : {}),
  } as SlideConfig;

  const handleConfigChange = (newConfig: Partial<SlideConfig>) => {
    const updatedSlide: Partial<Slide> = {
      ...newConfig,
      type: newConfig.type === 'bullet' ? SlideType.BULLET_LIST :
            newConfig.type === 'chart' ? SlideType.CHART :
            newConfig.type === 'nested-charts' ? SlideType.NESTED_CHARTS :
            slide.type,
    };
    onSlideChange(index, updatedSlide);
  };

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
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            {slide.getName()}
          </Typography>
        )}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          onClick={() => onToggleExpanded(index)}
        >
          {getSlideIcon(slide.type)}
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
          <SlideGroupEditor
            type={slide.type}
            config={slideConfig}
            onChange={handleConfigChange}
            onDelete={() => onDelete(index)}
          />
        )}
      </TimelineContent>
    </TimelineItem>
  );
};

export default SlideGroupTimelineItem;
