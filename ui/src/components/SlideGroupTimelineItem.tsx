import React from 'react';
import { TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent, TimelineOppositeContent } from '@mui/lab';
import { Typography, Box } from '@mui/material';
import { SlideConfig, SlideType } from '../types/slides';
import SlideGroupEditor, { getSlideIcon } from './editors/SlideGroupEditor';
import { SlideGroupConfig } from '../types/slide_groups';

interface SlideGroupTimelineItemProps {
  slideGroup: SlideGroupConfig;
  index: number;
  slideGroups: SlideGroupConfig[];
  expandedItems: boolean[];
  onToggleExpanded: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onSlideGroupChange: (index: number, newConfig: Partial<SlideGroupConfig>) => void;
  onDelete: (index: number) => void;
}

const SlideGroupTimelineItem: React.FC<SlideGroupTimelineItemProps> = ({
  slideGroup,
  index,
  slideGroups,
  expandedItems,
  onToggleExpanded,
  onDragStart,
  onDragOver,
  onDrop,
  onSlideGroupChange,
  onDelete,
}) => {
  const slideGroupConfig: SlideGroupConfig = {
    type: slideGroup.type === SlideType.BULLETS ? 'bullet' :
          slideGroup.type === SlideType.CHART ? 'chart' :
          slideGroup.type === SlideType.PICTURE ? 'picture' : 'bullet',
    captions: { top_center: '', bottom_center: '' },
    ...(slideGroup.type === SlideType.BULLETS ? {
      content: slideGroup.slides[0].content || [],
    } : slideGroup.type === SlideType.CHART ? {
      url: slideGroup.slides[0].content.url || '',
      goal: slideGroup.slides[0].content.goal || 0,
      rounding: slideGroup.slides[0].content.rounding || 0,
      units: slideGroup.slides[0].content.units || '',
    } : slideGroup.type === SlideType.PICTURE ? {
      content: {},
    } : {}),
  } as SlideGroupConfig;

  // const handleConfigChange = (newConfig: Partial<SlideGroupConfig>) => {
  //   const updatedSlideGroupConfig: Partial<SlideGroupConfig> = {
  //     ...newConfig,
  //     type: newConfig.type === 'bullets' ? SlideType.BULLETS :
  //           newConfig.type === 'chart' ? SlideType.CHART :
  //           newConfig.type === 'picture' ? SlideType.PICTURE :
  //           slideGroup.type,
  //   };
  //   onSlideGroupChange(index, updatedSlideGroupConfig);
  // };

  return (
    <TimelineItem 
      key={index}
      sx={{ cursor: 'default' }}
    >
      <TimelineOppositeContent
        onClick={() => onToggleExpanded(index)}
        sx={{ cursor: 'pointer' }}
      >
        {/* {slideGroup.getName && ( */}
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
            {/* {slideGroup.getName()} */}
            slide-name-goes-here
          </Typography>
        {/* )} */}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          onClick={() => onToggleExpanded(index)}
        >
          {getSlideIcon(slideGroup.type)}
        </TimelineDot>
        {index < slideGroups.length - 1 && (
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
        {/* {expandedItems[index] && (
          <SlideGroupEditor
            type={slideGroup.type}
            config={slideGroupConfig}
            onChange={handleConfigChange}
            onDelete={() => onDelete(index)}
          />
        )} */}
      </TimelineContent>
    </TimelineItem>
  );
};

export default SlideGroupTimelineItem;
