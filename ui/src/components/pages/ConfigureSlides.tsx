import React, { useState, useCallback } from 'react';
import { Timeline, TimelineItem, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses, TimelineSeparator } from '@mui/lab';
import { Box, Dialog, DialogContent, DialogTitle, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { Add, FormatListBulleted, Landscape, Timeline as TimelineIcon } from '@mui/icons-material';
import { useConfig } from '../../context/ConfigContext';
import { SlideType } from '../../types/slides';
import SlideGroupTimelineItem from '../SlideGroupTimelineItem';
import { BulletSlideGroupConfig, ChartSlideGroupConfig, PictureSlideGroupConfig, SlideGroupConfig } from '../../types/slide_groups';
import SlideGroupEditor from '../editors/SlideGroupEditor';

const ConfigureSlides: React.FC = () => {
  const { dashboard, setDashboard } = useConfig();
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSlideGroupChange = (index: number, newConfig: Partial<SlideGroupConfig>) => {
    const newSlideGroups = [...dashboard.slideGroups];
    const currentSlideGroup = newSlideGroups[index];
    newSlideGroups[index] = { ...currentSlideGroup, ...newConfig } as SlideGroupConfig;
    setDashboard({ ...dashboard, slideGroups: newSlideGroups });
  };

  const handleSlideGroupOrderChange = useCallback((newSlideGroupConfigs: SlideGroupConfig[]) => {
    setDashboard({ ...dashboard, slideGroups: newSlideGroupConfigs });
  }, [setDashboard, dashboard]);

  const handleAddSlide = (type: SlideType) => {
    let newSlideGroupConfig: SlideGroupConfig;
    
    switch (type) {
      case SlideType.BULLETS:
        newSlideGroupConfig = {
          type,
          name: "",
          slides: [{ type: SlideType.BULLETS, bullets: [] }],
          captions: {}
        } as BulletSlideGroupConfig;
        break;
      case SlideType.CHART:
        newSlideGroupConfig = {
          type,
          name: "",
          slides: [{ 
            type: SlideType.CHART, 
            source: "", 
            goal: 0, 
            rounding: 0, 
            units: "" 
          }],
          captions: {}
        } as ChartSlideGroupConfig;
        break;
      default:
        newSlideGroupConfig = {
          type: SlideType.PICTURE,
          name: "",
          source: "",
          slide_count: 3,
          slides: Array(3).fill({ type: SlideType.PICTURE }),
          captions: {}
        } as PictureSlideGroupConfig;
    }
    
    const newSlideGroups = [...dashboard.slideGroups, newSlideGroupConfig];
    handleSlideGroupOrderChange(newSlideGroups);
  };

  const handleClick = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const handleCloseModal = () => {
    setEditingIndex(null);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    const dragPreview = document.createElement('div');
    dragPreview.className = 'drag-preview';
    dragPreview.textContent = dashboard.slideGroups[index].name;
    dragPreview.style.cssText = `
      position: fixed;
      top: -1000px;
      padding: 8px 16px;
      background: rgba(25, 118, 210, 0.9);
      color: white;
      border-radius: 4px;
      font-family: system-ui;
      pointer-events: none;
      z-index: 1000;
    `;
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    setTimeout(() => document.body.removeChild(dragPreview), 0);
    
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggingIndex(index);
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
  };

  const handleSlideGroupDelete = (index: number) => {
    const newSlideGroups = [...dashboard.slideGroups];
    newSlideGroups.splice(index, 1);
    handleSlideGroupOrderChange(newSlideGroups);
  };

  return (
    <>
      <Timeline
        sx={{
          left: "0px",
          [`& .${timelineOppositeContentClasses.root}`]: {
          width: '0px',
          maxWidth: '0px',
          padding: '8px 8px',
          marginTop: 0,
          marginBottom: 0
          },
          [`& .MuiTimelineItem-root`]: {
            minHeight: '80px',
            '&[draggable="true"]': {
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing'
              }
            },
            '&.dragging': {
              opacity: 0.5,
              '& .timeline-text': {
                backgroundColor: 'primary.main'
              }
            },
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
            // flex: '0 0 150px',
            maxWidth: '0px',
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
            onToggleExpanded={() => handleClick(index)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDelete={handleSlideGroupDelete}
            className={draggingIndex === index ? 'dragging' : ''}
          />
        ))}
        <TimelineItem>
          <TimelineOppositeContent />
          <TimelineContent>
            <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
              <SpeedDial
                ariaLabel="Slide group actions"
                icon={<SpeedDialIcon />}
                direction="right"
                sx={{
                  marginLeft: -3
                }}
              >
                <SpeedDialAction
                  icon={<FormatListBulleted />}
                  tooltipTitle="Add Bullet List"
                  onClick={(e) => handleAddSlide(SlideType.BULLETS)}
                />
                <SpeedDialAction
                  icon={<Landscape />}
                  tooltipTitle="Add Picture Slides"
                  onClick={(e) => handleAddSlide(SlideType.PICTURE)}
                />
                <SpeedDialAction
                  icon={<TimelineIcon />}
                  tooltipTitle="Add Chart"
                  onClick={(e) => handleAddSlide(SlideType.CHART)}
                />
              </SpeedDial>
            </Box>
          </TimelineContent>
        </TimelineItem>
      </Timeline>

      <Dialog
        open={editingIndex !== null}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {editingIndex !== null && (
            <SlideGroupEditor
              type={dashboard.slideGroups[editingIndex].type}
              config={dashboard.slideGroups[editingIndex]}
              onChange={(newConfig) => handleSlideGroupChange(editingIndex, newConfig)}
              onDelete={() => {
                handleSlideGroupDelete(editingIndex);
                handleCloseModal();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfigureSlides;
