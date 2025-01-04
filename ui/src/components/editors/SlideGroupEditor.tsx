import React, { useState, useEffect } from 'react';
import { SlideType, Captions } from '../../data/slide_interfaces';
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
import BulletListConfig from './BulletSlideGroupEditor';
import ChartConfig from './ChartSlideGroupEditor';
import NestedChartsConfig from './NestedChartsSlideGroupEditor';

interface SlideGroupEditorProps {
  type: SlideType;
  content?: any;
  captions?: Captions;
  url?: string;
  goal?: number;
  rounding?: number;
  units?: string;
  onChange: (config: any) => void;
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
      return 'Gallery';
    case SlideType.NESTED_CHARTS:
      return 'Nested Charts';
    case SlideType.NESTED_BULLET_LIST:
      return 'Nested Bullet List';
    case SlideType.CHART:
      return 'Chart';
    default:
      return '';
  }
};

const shownSlideTypes = [
  SlideType.NESTED_IMAGES,
  SlideType.BULLET_LIST,
  // SlideType.NESTED_CHARTS,
  // SlideType.NESTED_BULLET_LIST,
  SlideType.CHART,
];

const SlideGroupEditor: React.FC<SlideGroupEditorProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {
      console.warn('Dialog action was called before being set');
    },
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsCollapsed(false);
    });
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget) {
      props.onTransitionEnd?.();
    }
  };

  const handleConfirm = () => {
    confirmDialog.action();
    setConfirmDialog(prev => ({ ...prev, open: false }));
    setSpeedDialOpen(false);
  };

  const handleCancel = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
    setSpeedDialOpen(false);
  };

  const showConfirmation = (title: string, message: string, action: () => void) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      action,
    });
  };

  const handleTypeChange = (newType: SlideType) => {
    showConfirmation(
      'Change Slide Type',
      `Are you sure you want to change this slide to a ${formatSlideType(newType)}? This will reset the slide's content.`,
      () => props.onChange({ type: newType })
    );
  };

  const handleDelete = () => {
    showConfirmation(
      'Delete Slide',
      'Are you sure you want to delete this slide? This action cannot be undone.',
      () => props.onDelete?.()
    );
  };

  const slideTypeActions = [
    ...Object.values(shownSlideTypes).map(type => ({
      icon: getSlideIcon(type),
      name: formatSlideType(type),
      onClick: () => handleTypeChange(type)
    })),
    ...(props.onDelete ? [{
      icon: <Delete />,
      name: 'Delete Slide',
      onClick: handleDelete
    }] : [])
  ];

  return (
    <div className={styles['slide-config-wrapper']}>
      <Dialog
        open={confirmDialog.open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent id="alert-dialog-description">
          {confirmDialog.message}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <div
        className={clsx(styles['slide-config'], {
          [styles['collapsed']]: isCollapsed,
        })}
        onTransitionEnd={handleTransitionEnd}
      >
        <Card elevation={2} sx={{ '&:hover': { elevation: 4 } }}>
          <CardContent>
            <div style={{ display: 'flex', backgroundColor: 'var(--border-color)', justifyContent: 'space-between' }}>
              <Typography variant="h5" fontWeight="bold" sx={{ py: 2, display: 'inline-block' }}>
                {formatSlideType(props.type)}
              </Typography>
              <SpeedDial
                ariaLabel="Change slide type"
                icon={<SpeedDialIcon openIcon={<Build />} icon={<Build />} />}
                open={speedDialOpen}
                onOpen={() => setSpeedDialOpen(true)}
                onClose={() => setSpeedDialOpen(false)}
                direction="right"
                className={styles['slide-type-speed-dial']}
              >
                {slideTypeActions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={action.onClick}
                  />
                ))}
              </SpeedDial>
            </div>
            {props.type === SlideType.BULLET_LIST && (
              <BulletListConfig
                content={props.content || []}
                captions={props.captions}
                onChange={props.onChange}
              />
            )}
            {props.type === SlideType.CHART && (
              <ChartConfig
                url={props.url || ''}
                goal={props.goal || 0}
                rounding={props.rounding || 0}
                units={props.units || ''}
                captions={props.captions}
                onChange={props.onChange}
              />
            )}
            {props.type === SlideType.NESTED_CHARTS && (
              <NestedChartsConfig
                content={props.content || []}
                captions={props.captions}
                onChange={props.onChange}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SlideGroupEditor;
