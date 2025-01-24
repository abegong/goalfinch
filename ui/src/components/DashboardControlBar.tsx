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
  onSlideClick: (index: number) => void;
}

const DashboardControlBar: React.FC<DashboardControlBarProps> = ({
  visible,
  onClose,
  slideGroups,
  visibleColorIndex,
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
        {slideGroups.map((slideGroup, index) => (
          <ListItem
            key={index}
            onClick={() => onSlideClick(index)}
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
                color: index === visibleColorIndex ? 'white' : 'black',
                borderRadius: '16px',
                backgroundColor: index === visibleColorIndex ? 'rgba(255,255,255,0.5)' : 'rgba(0, 0, 0, 0.1)',
                mr: '6px',
              }}
            >
              {slideGroup.type === SlideType.BULLETS && <FormatListBulleted />}
              {slideGroup.type === SlideType.PICTURE && <Landscape />}
              {/* {slide.type === SlideType.NESTED_CHARTS && <SsidChart />} */}
              {/* {slide.type === SlideType.NESTED_BULLET_LIST && <Segment />} */}
              {slideGroup.type === SlideType.CHART && <ShowChart />}
            </ListItemIcon>
            <ListItemText primary={getSlideGroupName(slideGroup)} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default DashboardControlBar;
