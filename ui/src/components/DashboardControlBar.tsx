import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Landscape, ShowChart, SsidChart, FormatListBulleted, Segment } from '@mui/icons-material';
import { SlideType } from '../types/slides';
import { SlideGroupConfig, getSlideGroupName } from '../types/slide_groups';


interface DashboardControlBarProps {
  visible: boolean;
  onClose: () => void;
  slideGroups: Array<SlideGroupConfig>;
  visibleColorIndex: number;
  activeSlideIndex: number;
  onSlideClick: (index: number) => void;
}

const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  visible,
  onClose,
  slideGroups,
  visibleColorIndex,
  activeSlideIndex,
  onSlideClick,
}) => {
  return (
    <Drawer
      component="aside"
      aria-label="Dashboard Control Bar"
      anchor="right"
      open={visible}
      onClose={onClose}
      hideBackdrop={true}
      variant="persistent"
      sx={{
        '& .MuiDrawer-paper': {
          bgcolor: 'rgb(255, 193, 5)',
          width: 240,
          padding: '10px',
        }
      }}
    >
      <Typography variant="h4" sx={{ ml: '20px', mt: '20px', mb: '20px' }}>
        Slides
      </Typography>
      <List sx={{ width: 220, borderTop: '1px solid rgba(0, 0, 0, 0.1)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', margin: '10px' }}>
        {slideGroups.map((slideGroup, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {/* Slide Group Header */}
            <ListItem
              onClick={() => onSlideClick(groupIndex)}
              sx={{
                cursor: 'pointer',
                m: 0,
                p: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 48,
                  color: 'black',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  mr: '6px',
                }}
              >
                {slideGroup.type === SlideType.BULLETS && <FormatListBulleted />}
                {slideGroup.type === SlideType.PICTURE && <Landscape />}
                {slideGroup.type === SlideType.CHART && <ShowChart />}
              </ListItemIcon>
              <ListItemText primary={getSlideGroupName(slideGroup)} />
            </ListItem>
            
            {/* Individual Slides */}
            {slideGroup.slides.map((_, slideIndex) => (
              <ListItem
                key={`${groupIndex}-${slideIndex}`}
                onClick={() => onSlideClick(groupIndex)}
                sx={{
                  cursor: 'pointer',
                  m: 0,
                  p: '6px',
                  pl: '32px', // Indent the individual slides
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    color: groupIndex === visibleColorIndex && slideIndex === activeSlideIndex ? 'white' : 'black',
                    borderRadius: '16px',
                    backgroundColor: groupIndex === visibleColorIndex && slideIndex === activeSlideIndex ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.1)',
                    mr: '6px',
                  }}
                >
                  {slideGroup.type === SlideType.BULLETS && <FormatListBulleted />}
                  {slideGroup.type === SlideType.PICTURE && <Landscape />}
                  {slideGroup.type === SlideType.CHART && <ShowChart />}
                </ListItemIcon>
              </ListItem>
            ))}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default DashboardControlBar;
