import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { Landscape, ShowChart, SsidChart, FormatListBulleted, Segment } from '@mui/icons-material';
import { SlideType } from '../types/slides';
import { SlideGroupConfig, getSlideGroupName } from '../types/slide_groups';


interface DashboardControlBarProps {
  visible: boolean;
  onClose: () => void;
  slideGroups: Array<SlideGroupConfig>;
  visibleColorIndex: number;
  activeSlideIndex: number;
  onSlideClick: (groupIndex: number, slideIndex: number) => void;
  isPaused?: boolean;
  onPauseChange: (paused: boolean) => void;
}

const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  visible,
  onClose,
  slideGroups,
  visibleColorIndex,
  activeSlideIndex,
  onSlideClick,
  isPaused = false,
  onPauseChange,
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
          width: "240px",
          padding: "10px",
        }
      }}
    >
      <Typography variant="h4" sx={{ ml: '0px', height: '94px' }}>
        {/* Slides */}
      </Typography>
      <List sx={{ width: 218, borderTop: '1px solid rgba(0, 0, 0, 0.1)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)', margin: 0 }}>
        {slideGroups.map((slideGroup, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {/* Slide Group Header */}
            <ListItem
              onClick={() => onSlideClick(groupIndex, 0)}
              sx={{
                cursor: 'pointer',
                m: 0,
                p: '6px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <ListItemText primary={getSlideGroupName(slideGroup)} />
            </ListItem>
            
            {/* Individual Slides */}
            {slideGroup.slides.map((_, slideIndex) => (
              <ListItem
                key={`${groupIndex}-${slideIndex}`}
                onClick={() => onSlideClick(groupIndex, slideIndex)}
                sx={{
                  cursor: 'pointer',
                  m: 0,
                  p: '2px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  },
                  borderRadius: '16px'
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 24,
                    color: groupIndex === visibleColorIndex && slideIndex === activeSlideIndex ? 'white' : 'black',
                    borderRadius: '16px',
                    backgroundColor: groupIndex === visibleColorIndex && slideIndex === activeSlideIndex ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.1)',
                    mr: '2px',
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
      <FormControlLabel
        control={
          <Checkbox 
            checked={isPaused} 
            onChange={(e) => onPauseChange(e.target.checked)}
            sx={{ color: 'black', '&.Mui-checked': { color: 'black' } }}
          />
        }
        label="Paused"
        sx={{ ml: '0px', mt: '10px' }}
      />
    </Drawer>
  );
};

export default DashboardControlBar;
