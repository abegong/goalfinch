import React, { useState, useEffect } from 'react';
import { TimelineItem, TimelineSeparator, TimelineContent, TimelineDot, TimelineConnector, TimelineOppositeContent } from '@mui/lab';
import { Box, IconButton, Typography } from '@mui/material';
import { Delete, DragIndicator } from '@mui/icons-material';
import { SlideGroupConfig, getSlideGroupName } from '../types/slide_groups';
import { getSlideIcon } from './editors/SlideGroupEditor';

interface SlideGroupTimelineItemProps {
  slideGroup: SlideGroupConfig;
  index: number;
  slideGroups: SlideGroupConfig[];
  onToggleExpanded: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onSlideGroupChange: (index: number, newConfig: Partial<SlideGroupConfig>) => void;
  onDelete: (index: number) => void;
  className?: string;
}

const SlideGroupTimelineItem: React.FC<SlideGroupTimelineItemProps> = ({
  slideGroup,
  index,
  slideGroups,
  onToggleExpanded,
  onDragStart,
  onDragOver,
  onDrop,
  onSlideGroupChange,
  onDelete,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragEnd = () => setIsDragging(false);
    document.addEventListener('dragend', handleDragEnd);
    return () => document.removeEventListener('dragend', handleDragEnd);
  }, []);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, index);
  };

  return (
    <TimelineItem
      key={index}
      draggable
      onDragStart={handleDragStart}
      onDragOver={onDragOver}
      onDrop={(e) => {
        onDrop(e, index);
        setIsDragging(false);
      }}
      className={[className, isDragging ? 'dragging' : ''].filter(Boolean).join(' ')}
      data-dragging={isDragging}
      data-testid="timeline-item"
      sx={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s'
      }}
      onClick={onToggleExpanded}
    >
      <TimelineOppositeContent
        sx={{ cursor: 'pointer' }}
      >
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
          {getSlideGroupName(slideGroup)}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography>{getSlideGroupName(slideGroup)}</Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
};

export default SlideGroupTimelineItem;
