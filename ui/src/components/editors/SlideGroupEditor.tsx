import React, { useState, useEffect } from 'react';
import { SlideType, slideTypes } from '../../types/slides';
import { 
  FormatListBulleted, 
  Landscape, 
  Timeline,
  Delete,
  Build,
  Segment,
  SsidChart,
  DeleteOutline,
  Add,
  SpaceBar
} from '@mui/icons-material';
import { 
  SpeedDial, 
  SpeedDialAction, 
  SpeedDialIcon, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  TextField,
  IconButton,
  Box,
  Paper
} from '@mui/material';
import styles from './SlideGroupEditor.module.css';
import clsx from 'clsx';
import { BulletEditor } from './BulletEditor';
import { ChartEditor } from './ChartEditor';
import { SlideConfig, PictureSlideConfig, BulletSlideConfig, ChartSlideConfig } from '../../types/slides';
import { CollapsibleSection } from './CollapsibleSection';
import { BulletSlideGroupConfig, ChartSlideGroupConfig, PictureSlideGroupConfig, SlideGroupConfig } from '../../types/slide_groups';
import PictureEditor from './PictureEditor';

interface SlideGroupEditorProps {
  type: SlideType;
  config: SlideGroupConfig;
  onChange: (config: Partial<SlideGroupConfig>) => void;
  onDelete?: () => void;
  onTransitionEnd?: () => void;
}

export const getSlideIcon = (type: SlideType) => {
  switch (type) {
    case SlideType.BULLETS:
      return <FormatListBulleted />;
    case SlideType.PICTURE:
      return <Landscape />;
    case SlideType.CHART:
      return <Timeline />;
    default:
      return null;
  }
};

const formatSlideType = (type: SlideType) => {
  switch (type) {
    case SlideType.BULLETS:
      return 'Bullet List';
    case SlideType.PICTURE:
      return 'Image';
    case SlideType.CHART:
      return 'Chart';
    default:
      return type;
  }
};

export const SlideGroupEditor: React.FC<SlideGroupEditorProps> = ({
  type,
  config,
  onChange,
  onDelete,
  onTransitionEnd,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);
  const [name, setName] = useState("Untitled Slide Group");

  useEffect(() => {
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  }, [type, onTransitionEnd]);

  const handleTypeChange = (newType: SlideType) => {
    let newConfig: Partial<SlideGroupConfig>;
    switch (newType) {
      case SlideType.BULLETS:
        newConfig = {
          type: SlideType.BULLETS,
          slides: [{
            type: SlideType.BULLETS,
            content: [''],
          }],
        };
        break;
      case SlideType.CHART:
        newConfig = {
          type: SlideType.CHART,
          slides: [{
            type: SlideType.CHART,
            content: {
              url: '',
              goal: 0,
              rounding: 0,
              units: '',
            }
          }],
        };
        break;
      case SlideType.PICTURE:
        newConfig = {
          type: SlideType.PICTURE,
          slide_count: 1,
        };
        break;
      default:
        throw new Error(`Unsupported slide type: ${newType}`);
    }
    onChange(newConfig);
    setIsSpeedDialOpen(false);
  };

  const renderEditor = () => {
    switch (type) {
      case SlideType.BULLETS:
        return (
          <BulletEditor
            config={config as BulletSlideGroupConfig}
            onChange={onChange}
          />
        );
      case SlideType.CHART:
        return (
          <ChartEditor
            configs={(config as ChartSlideGroupConfig).slides}
            onChange={(newSlides) => {
              onChange({
                slides: newSlides
              } as Partial<SlideGroupConfig>);
            }}
          />
        );
      case SlideType.PICTURE:
        return (
          <PictureEditor
            config={config as PictureSlideGroupConfig}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box className={styles.slideGroupHeader}>
        <TextField
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.slideGroupName}
          placeholder="Enter slide group name"
        />
        <Typography variant="h6" color="textSecondary">{formatSlideType(type)}</Typography>
        <Box flexGrow={0.25} />
        <IconButton 
          onClick={() => setIsDeleteDialogOpen(true)}
          className={styles.deleteButton}
          size="small"
        >
          <Delete />
        </IconButton>
      </Box>

      <Box className={styles.slideManagement}>
        <Box className={styles.slideList}>
          {config.slides?.map((slide, index) => (
            <Paper
              key={index}
              className={styles.slideThumb}
              elevation={1}
            >
              {getSlideIcon(slide.type)}
            </Paper>
          ))}
          <IconButton 
            className={styles.addSlideButton}
            size="small"
          >
            <Add />
          </IconButton>
        </Box>
      </Box>

      <CardContent>
        {renderEditor()}

        <CollapsibleSection title="Captions">
          <div className={styles['caption-config']}>
            <input
              type="text"
              placeholder="Top Center"
              value={config.captions?.top_center || ''}
              onChange={(e) => onChange({ captions: { ...config.captions, top_center: e.target.value } })}
            />
            <input
              type="text"
              placeholder="Bottom Center"
              value={config.captions?.bottom_center || ''}
              onChange={(e) => onChange({ captions: { ...config.captions, bottom_center: e.target.value } })}
            />
            <input
              type="text"
              placeholder="Bottom Right"
              value={config.captions?.bottom_right || ''}
              onChange={(e) => onChange({ captions: { ...config.captions, bottom_right: e.target.value } })}
            />
          </div>
        </CollapsibleSection>
      </CardContent>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Slide Group?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this slide group? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              if (onDelete) onDelete();
              setIsDeleteDialogOpen(false);
            }} 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SlideGroupEditor;
