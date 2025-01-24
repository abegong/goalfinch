import React, { useState, useCallback } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab';
import { Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useConfig } from '../../context/ConfigContext';
import { SlideConfig, SlideType } from '../../types/slides';
// import { BaseSlide, Slide } from '../slides/Slide';
import SlideGroupTimelineItem from '../SlideGroupTimelineItem';
import { PictureSlideGroupConfig, SlideGroupConfig } from '../../types/slide_groups';

const ConfigureSlides: React.FC = () => {
  const { dashboard, setDashboard } = useConfig();
  const [expandedItems, setExpandedItems] = useState<boolean[]>([]);

  const handleSlideGroupChange = (index: number, newConfig: Partial<SlideGroupConfig>) => {
    const newSlideGroups = [...dashboard.slideGroups];
    const currentSlideGroup = newSlideGroups[index];
    newSlideGroups[index] = { ...currentSlideGroup, ...newConfig } as SlideGroupConfig;
    setDashboard({ ...dashboard, slideGroups: newSlideGroups });
  };

  const handleSlideGroupOrderChange = useCallback((newSlideGroupConfigs: SlideGroupConfig[]) => {
    setDashboard({ ...dashboard, slideGroups: newSlideGroupConfigs });
  }, [setDashboard, dashboard]);

  const handleAddSlide = () => {
    const newSlideGroupConfig = {
      type : SlideType.PICTURE,
      slide_count: 3,
    } as PictureSlideGroupConfig;
    const newSlideGroups = [...dashboard.slideGroups, newSlideGroupConfig];
    handleSlideGroupOrderChange(newSlideGroups);
    
    // Update expanded and animating states
    setExpandedItems([...expandedItems, false]);
  };

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems(prevExpandedItems => {
      const newExpandedItems = [...prevExpandedItems];
      newExpandedItems[index] = !newExpandedItems[index];
      return newExpandedItems;
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.stopPropagation();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === targetIndex) return;

    const newSlideGroups = [...dashboard.slideGroups];
    const [removed] = newSlideGroups.splice(sourceIndex, 1);
    newSlideGroups.splice(targetIndex, 0, removed);
    handleSlideGroupOrderChange(newSlideGroups);

    // Update expanded and animating states to match new order
    const newExpandedItems = [...expandedItems];
    const [removedExpanded] = newExpandedItems.splice(sourceIndex, 1);
    newExpandedItems.splice(targetIndex, 0, removedExpanded);
    setExpandedItems(newExpandedItems);
  };

  const handleSlideGroupDelete = (index: number) => {
    const newSlideGroups = [...dashboard.slideGroups];
    newSlideGroups.splice(index, 1);
    handleSlideGroupOrderChange(newSlideGroups);
    
    // Update expanded and animating states to match new array length
    const newExpandedItems = [...expandedItems];
    newExpandedItems.splice(index, 1);
    
    setExpandedItems(newExpandedItems);
  };

  return (
    <Timeline
      sx={{
        left: "0px",
        marginLeft: "-200px",
        [`& .${timelineOppositeContentClasses.root}`]: {
          width: '240px',
          maxWidth: '240px',
          padding: '8px 8px',
          marginTop: 0,
          marginBottom: 0
        },
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
        [`& .${TimelineOppositeContent}`]: {
          flex: '0 0 150px',
          maxWidth: '150px',
          padding: '8px 8px',
          marginTop: 0,
          marginBottom: 0
        },
      }}
    >
      {dashboard.slideGroups.map((slideGroup, index) => (
        <SlideGroupTimelineItem
          key={index}
          slideGroup={slideGroup}
          index={index}
          slideGroups={dashboard.slideGroups}
          expandedItems={expandedItems}
          onToggleExpanded={toggleExpanded}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onSlideGroupChange={handleSlideGroupChange}
          onDelete={handleSlideGroupDelete}
        />
      ))}
      <TimelineItem>
        <TimelineOppositeContent />
        <TimelineSeparator>
          <TimelineDot
            sx={{
              p: 0,
              borderRadius: '6px',
              width: '50px',
              height: '50px',
              justifyContent: 'center',
              backgroundColor: 'primary.main',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: 'primary.dark'
              }
            }}
            onClick={handleAddSlide}
          >
            <Box sx={{
              fontSize: '42px',
              '& > svg': {
                width: '42px',
                height: '42px'
              }
            }}>
              <Add />
            </Box>
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent />
      </TimelineItem>
    </Timeline>
  );
};

export default ConfigureSlides;
