import React, { useState, useEffect } from 'react';
import { SlideType } from '../../data/slide_interfaces';
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
import { BulletSlideGroupEditor } from './BulletSlideGroupEditor';
import { ChartSlideGroupEditor } from './ChartSlideGroupEditor';
import { NestedChartsSlideGroupEditor } from './NestedChartsSlideGroupEditor';
import { SlideConfig, BulletSlideConfig, ChartSlideConfig, NestedChartsSlideConfig } from './slide_editor_types';
import { CollapsibleSection } from './CollapsibleSection';

interface SlideGroupEditorProps {
  type: SlideType;
  config: SlideConfig;
  onChange: (config: Partial<SlideConfig>) => void;
  onDelete?: () => void;
  onTransitionEnd?: () => void;
}

export const getSlideIcon = (type: SlideType) => {
  switch (type) {
    case SlideType.BULLET_LIST:
      return <FormatListBulleted />;
    case SlideType.NESTED_IMAGES:
      return <Landscape />;
    case SlideType.NESTED_CHARTS:
      return <SsidChart />;
    case SlideType.NESTED_BULLET_LIST:
      return <Segment />;
    case SlideType.CHART:
      return <Timeline />;
    default:
      return null;
  }
};

const formatSlideType = (type: SlideType) => {
  switch (type) {
    case SlideType.BULLET_LIST:
      return 'Bullet List';
    case SlideType.NESTED_IMAGES:
      return 'Image Gallery';
    case SlideType.NESTED_CHARTS:
      return 'Chart Gallery';
    case SlideType.NESTED_BULLET_LIST:
      return 'Bullet List Gallery';
    case SlideType.CHART:
      return 'Chart';
    default:
      return type;
  }
};

const shownSlideTypes = [
  SlideType.NESTED_IMAGES,
  SlideType.BULLET_LIST,
  SlideType.CHART,
  SlideType.NESTED_BULLET_LIST,
];

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
    let newConfig: SlideConfig;
    switch (newType) {
      case SlideType.BULLET_LIST:
        newConfig = {
          type: 'bullet',
          content: [''],
          captions: config.captions,
        } as BulletSlideConfig;
        break;
      case SlideType.CHART:
        newConfig = {
          type: 'chart',
          url: '',
          goal: 0,
          rounding: 0,
          units: '',
          captions: config.captions,
        } as ChartSlideConfig;
        break;
      case SlideType.NESTED_CHARTS:
        newConfig = {
          type: 'nested-charts',
          content: [],
          captions: config.captions,
        } as NestedChartsSlideConfig;
        break;
      default:
        return;
    }
    onChange(newConfig);
  };

  const renderEditor = () => {
    switch (type) {
      case SlideType.BULLET_LIST:
        return (
          <BulletSlideGroupEditor
            config={config as BulletSlideConfig}
            onChange={onChange}
          />
        );
      case SlideType.CHART:
        return (
          <ChartSlideGroupEditor
            config={config as ChartSlideConfig}
            onChange={onChange}
          />
        );
      case SlideType.NESTED_CHARTS:
        return (
          <NestedChartsSlideGroupEditor
            config={config as NestedChartsSlideConfig}
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
              {shownSlideTypes
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
