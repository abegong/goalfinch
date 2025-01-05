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
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Card, CardContent } from '@mui/material';
import styles from './SlideGroupEditor.module.css';
import clsx from 'clsx';
import { BulletEditor } from './BulletEditor';
import { ChartEditor } from './ChartEditor';
import { SlideConfig, PictureSlideConfig, BulletSlideConfig, ChartSlideConfig } from '../../types/slides';
import { CollapsibleSection } from './CollapsibleSection';
import { BulletSlideGroupConfig, ChartSlideGroupConfig, PictureSlideGroupConfig, SlideGroupConfig } from '../../types/editors';
import PictureEditor from './PictureEditor';

interface SlideGroupEditorProps {
  type: SlideType;
  config: SlideConfig;
  onChange: (config: Partial<SlideConfig>) => void;
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

  useEffect(() => {
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  }, [type, onTransitionEnd]);

  const handleTypeChange = (newType: SlideType) => {
    let newConfig: SlideGroupConfig;
    switch (newType) {
      case SlideType.BULLETS:
        newConfig = {
          type: SlideType.BULLETS,
          slides: [{
            type: SlideType.BULLETS,
            content: [''],
          }]
          // captions: config.captions,
        } as BulletSlideGroupConfig;
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
          // captions: config.captions,
        } as ChartSlideGroupConfig;
        break;
      case SlideType.PICTURE:
        newConfig = {
          type: SlideType.PICTURE,
          slide_count: 1,
          // captions: config.captions,
        } as PictureSlideGroupConfig;
        break;
      default:
        return;
    }
    onChange(newConfig);
  };

  const renderEditor = () => {
    switch (type) {
      // case SlideType.BULLETS:
      //   return (
      //     <BulletEditor
      //       config={config as BulletSlideGroupConfig}
      //       onChange={onChange}
      //     />
      //   );
      // case SlideType.CHART:
      //   return (
      //     <ChartEditor
      //       config={config as ChartSlideGroupConfig}
      //       onChange={onChange}
      //     />
      //   );
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
    <Card className={styles['slide-group-editor-card']}>
      <CardContent>
        <div className={styles['slide-group-editor-header']}>
          <Typography variant="h6">{formatSlideType(type)}</Typography>
          <div className={styles['slide-group-editor-actions']}>
            <SpeedDial
              ariaLabel="Slide group actions"
              icon={<SpeedDialIcon icon={<Build />} />}
              onClose={() => setIsSpeedDialOpen(false)}
              onOpen={() => setIsSpeedDialOpen(true)}
              open={isSpeedDialOpen}
              direction="left"
              className={styles['speed-dial']}
            >
              {slideTypes
                .filter((t) => t !== type)
                .map((t) => (
                  <SpeedDialAction
                    key={t}
                    icon={getSlideIcon(t)}
                    tooltipTitle={formatSlideType(t)}
                    onClick={() => handleTypeChange(t)}
                  />
                ))}
              {onDelete && (
                <SpeedDialAction
                  icon={<Delete />}
                  tooltipTitle="Delete"
                  onClick={() => setIsDeleteDialogOpen(true)}
                />
              )}
            </SpeedDial>
          </div>
        </div>

        {renderEditor()}

        {/* <CollapsibleSection title="Captions">
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
        </CollapsibleSection> */}

        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Slide Group</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this slide group? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                setIsDeleteDialogOpen(false);
                if (onDelete) onDelete();
              }}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SlideGroupEditor;
