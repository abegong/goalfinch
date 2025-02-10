import React, { useState, useEffect } from 'react';
import { TimelineItem, TimelineSeparator, TimelineContent, TimelineDot, TimelineConnector, TimelineOppositeContent } from '@mui/lab';
import { Box, IconButton, Typography } from '@mui/material';
import { Delete, DragIndicator } from '@mui/icons-material';
import { SlideGroupConfig } from '../types/slide_groups';
import { getSlideIcon } from './editors/SlideGroupEditor';
import styles from './SlideGroupTimelineItem.module.css';
import clsx from 'clsx';

interface SlideGroupTimelineItemProps {
  slideGroup: SlideGroupConfig;
  index: number;
  slideGroups: SlideGroupConfig[];
  onToggleExpanded: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDelete: (index: number) => void;
  isBeingDraggedOver: boolean;
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
  onDelete,
  isBeingDraggedOver,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);

  useEffect(() => {
    const handleDragEnd = () => {
      setIsDragging(false);
      setDropPosition(null);
    };
    document.addEventListener('dragend', handleDragEnd);
    return () => document.removeEventListener('dragend', handleDragEnd);
  }, []);

  useEffect(() => {
    if (!isBeingDraggedOver) {
      setDropPosition(null);
    }
  }, [isBeingDraggedOver]);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDropPosition(e.clientY < midY ? 'above' : 'below');
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, index);
    setIsDragging(false);
    setDropPosition(null);
  };

  return (
    <TimelineItem
      key={index}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={clsx(
        styles.timelineItem,
        className,
        {
          [styles.dragging]: isDragging,
          [styles.dropAbove]: dropPosition === 'above',
          [styles.dropBelow]: dropPosition === 'below',
        }
      )}
      data-dragging={isDragging}
      data-testid="timeline-item"
      sx={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s'
      }}
      onClick={onToggleExpanded}
    >
      <TimelineOppositeContent />
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
        <Typography 
          color="text.secondary"
          className={clsx("timeline-text", styles.timelineText)}
          sx={{
            display: 'inline-block',
            margin: '4px -24px 0px 0px',
            padding: '8px 32px 8px 12px',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
          }}
        >
          {slideGroup.name}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
};

export default SlideGroupTimelineItem;
