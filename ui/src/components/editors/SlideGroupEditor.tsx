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
  const [name, setName] = useState(config.name || "Untitled Slide Group");
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);
  const [isDeleteSlideDialogOpen, setIsDeleteSlideDialogOpen] = useState(false);

  useEffect(() => {
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  }, [type, onTransitionEnd]);

  useEffect(() => {
    // Update name when config changes
    setName(config.name || "Untitled Slide Group");
  }, [config.name]);

  const handleAddSlide = () => {
    let bulletConfig: BulletSlideGroupConfig;
    let chartConfig: ChartSlideGroupConfig;
    let pictureConfig: PictureSlideGroupConfig;
    
    switch (type) {
      case SlideType.BULLETS:
        bulletConfig = config as BulletSlideGroupConfig;
        onChange({
          slides: [...(bulletConfig.slides || []), {
            type: SlideType.BULLETS,
            bullets: ['']
          }]
        } as Partial<BulletSlideGroupConfig>);
        break;
      case SlideType.CHART:
        chartConfig = config as ChartSlideGroupConfig;
        onChange({
          slides: [...(chartConfig.slides || []), {
            type: SlideType.CHART,
            source: '',
            csv_extraction: null,
            goal: 0,
            rounding: 0,
            units: '',
            asOfDate: '',
            title: '',
          }]
        } as Partial<ChartSlideGroupConfig>);
        break;
      case SlideType.PICTURE:
        pictureConfig = config as PictureSlideGroupConfig;
        onChange({
          slides: [...(pictureConfig.slides || []), {
            type: SlideType.PICTURE,
          }]
        } as Partial<PictureSlideGroupConfig>);
        break;
      default:
        throw new Error(`Unsupported slide type: ${type}`);
    }
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    setSlideToDelete(indexToDelete);
    setIsDeleteSlideDialogOpen(true);
  };

  const confirmDeleteSlide = () => {
    if (slideToDelete === null) return;

    // Don't allow deleting the last slide
    if (!config.slides || config.slides.length <= 1) {
      return;
    }

    // Create new slides array without the deleted slide
    switch (type) {
      case SlideType.BULLETS: {
        const bulletConfig = config as BulletSlideGroupConfig;
        const newSlides = bulletConfig.slides.filter((_: BulletSlideConfig, index: number) => index !== slideToDelete);
        onChange({ slides: newSlides } as Partial<BulletSlideGroupConfig>);
        break;
      }
      case SlideType.CHART: {
        const chartConfig = config as ChartSlideGroupConfig;
        const newSlides = chartConfig.slides.filter((_: ChartSlideConfig, index: number) => index !== slideToDelete);
        onChange({ slides: newSlides } as Partial<ChartSlideGroupConfig>);
        break;
      }
      case SlideType.PICTURE: {
        const pictureConfig = config as PictureSlideGroupConfig;
        const newSlides = pictureConfig.slides.filter((_: PictureSlideConfig, index: number) => index !== slideToDelete);
        onChange({ slides: newSlides } as Partial<PictureSlideGroupConfig>);
        break;
      }
      default:
        throw new Error(`Unsupported slide type: ${type}`);
    }
    
    // Update the selected slide index if needed
    if (selectedSlideIndex >= slideToDelete && selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    }

    // Close the dialog and reset the slideToDelete
    setIsDeleteSlideDialogOpen(false);
    setSlideToDelete(null);
  };

  const renderEditor = () => {
    switch (type) {
      case SlideType.BULLETS:
        return (
          <BulletEditor
            config={config as BulletSlideGroupConfig}
            selectedSlideIndex={selectedSlideIndex}
            onChange={onChange}
          />
        );
      case SlideType.CHART:
        return (
          <ChartEditor
            configs={(config as ChartSlideGroupConfig).slides}
            selectedSlideIndex={selectedSlideIndex}
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
          onChange={(e) => {
            const newName = e.target.value;
            setName(newName);
            onChange({ name: newName });
          }}
          className={styles.slideGroupName}
          placeholder="Enter slide group name"
        />
        <Box sx={{ ml: 2, mr: 1 }} color="textSecondary">
          {getSlideIcon(type)}
        </Box>
        <Typography variant="h6" color="textSecondary">
          {formatSlideType(type)}
        </Typography>
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box className={styles.slideList}>
            {config.slides?.map((slide, index) => (
              <Paper
                key={index}
                className={clsx(styles.slideThumb, {
                  [styles.selectedSlide]: index === selectedSlideIndex
                })}
                elevation={1}
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedSlideIndex(index)}
              >
                {getSlideIcon(slide.type)}
              </Paper>
            ))}
            <IconButton 
              className={styles.addSlideButton}
              onClick={handleAddSlide}
              sx={{ padding: '8px' }}
            >
              <Add sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
          {config.slides && config.slides.length > 1 && (
            <IconButton 
              onClick={() => handleDeleteSlide(selectedSlideIndex)}
              sx={{
                padding: '8px',
                backgroundColor: 'white',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <DeleteOutline sx={{ fontSize: 24 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      <CardContent>
        {renderEditor()}

        {/*
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
        */}
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

      <Dialog
        open={isDeleteSlideDialogOpen}
        onClose={() => {
          setIsDeleteSlideDialogOpen(false);
          setSlideToDelete(null);
        }}
      >
        <DialogTitle>Delete Slide?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this slide? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsDeleteSlideDialogOpen(false);
              setSlideToDelete(null);
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteSlide} 
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
