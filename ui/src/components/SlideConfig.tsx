import React, { useState, useEffect } from 'react';
import { SlideType, Captions } from '../data/slide_data';
import { 
  FormatListBulleted, 
  Landscape, 
  ShowChart, 
  List, 
  Timeline,
  ExpandMore,
  ExpandLess,
  Edit,
  Delete
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './SlideConfig.module.css';
import clsx from 'clsx';

interface BaseSlideConfigProps {
  captions?: Captions;
  onChange: (config: any) => void;
}

export const BaseSlideConfig: React.FC<BaseSlideConfigProps> = ({ captions, onChange }) => {
  return (
    <div className={styles['slide-config']}>
      <div className={styles['caption-config']}>
        <h3>Captions</h3>
        <input
          type="text"
          placeholder="Top Center"
          value={captions?.top_center || ''}
          onChange={(e) => onChange({ ...captions, top_center: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bottom Center"
          value={captions?.bottom_center || ''}
          onChange={(e) => onChange({ ...captions, bottom_center: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bottom Right"
          value={captions?.bottom_right || ''}
          onChange={(e) => onChange({ ...captions, bottom_right: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bottom Left"
          value={captions?.bottom_left || ''}
          onChange={(e) => onChange({ ...captions, bottom_left: e.target.value })}
        />
      </div>
    </div>
  );
};

interface BulletListConfigProps extends BaseSlideConfigProps {
  content: string[];
}

export const BulletListConfig: React.FC<BulletListConfigProps> = ({ content, captions, onChange }) => {
  const handleBulletChange = (index: number, value: string) => {
    const newContent = [...content];
    newContent[index] = value;
    onChange({ content: newContent });
  };

  return (
    <div>
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
      <div className={styles['bullet-list-config']}>
        <h3>Bullet Points</h3>
        {content.map((bullet, index) => (
          <input
            key={index}
            type="text"
            value={bullet}
            onChange={(e) => handleBulletChange(index, e.target.value)}
          />
        ))}
        <button onClick={() => onChange({ content: [...content, ''] })}>Add Bullet</button>
      </div>
    </div>
  );
};

interface LookForwardChartConfigProps extends BaseSlideConfigProps {
  url: string;
  goal: number;
  rounding: number;
  units: string;
}

export const LookForwardChartConfig: React.FC<LookForwardChartConfigProps> = ({
  url,
  goal,
  rounding,
  units,
  captions,
  onChange,
}) => {
  return (
    <div>
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
      <div className={styles['chart-config']}>
        <h3>Chart Settings</h3>
        <input
          type="text"
          placeholder="Data URL"
          value={url}
          onChange={(e) => onChange({ url: e.target.value })}
        />
        <input
          type="number"
          placeholder="Goal"
          value={goal}
          onChange={(e) => onChange({ goal: parseFloat(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Rounding"
          value={rounding}
          onChange={(e) => onChange({ rounding: parseInt(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Units"
          value={units}
          onChange={(e) => onChange({ units: e.target.value })}
        />
      </div>
    </div>
  );
};

interface NestedChartsConfigProps extends BaseSlideConfigProps {
  content: any[];
}

export const NestedChartsConfig: React.FC<NestedChartsConfigProps> = ({ content, captions, onChange }) => {
  return (
    <div>
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
      <div className={styles['nested-charts-config']}>
        <h3>Nested Charts</h3>
        {content.map((chart, index) => (
          <LookForwardChartConfig
            key={index}
            {...chart}
            onChange={(newConfig) => {
              const newContent = [...content];
              newContent[index] = { ...newContent[index], ...newConfig };
              onChange({ content: newContent });
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface SlideConfigProps {
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
      return <ShowChart />;
    case SlideType.NESTED_BULLET_LIST:
      return <List />;
    case SlideType.LOOK_FORWARD_CHART:
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
      return 'Nested Images';
    case SlideType.NESTED_CHARTS:
      return 'Nested Charts';
    case SlideType.NESTED_BULLET_LIST:
      return 'Nested Bullet List';
    case SlideType.LOOK_FORWARD_CHART:
      return 'Look Forward Chart';
    default:
      return '';
  }
};

const SlideConfig: React.FC<SlideConfigProps> = (props) => {
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
    action: () => {},
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
    ...Object.values(SlideType).map(type => ({
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
      <SpeedDial
        ariaLabel="Change slide type"
        icon={<SpeedDialIcon openIcon={<Edit />} />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
        direction="left"
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
      <div
        className={clsx(styles['slide-config'], {
          [styles['collapsed']]: isCollapsed,
        })}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className={styles['slide-config-header']}>
          <div className={styles['slide-type']}>
            {getSlideIcon(props.type)}
            <span>{formatSlideType(props.type)}</span>
          </div>
          <button
            className={styles['collapse-button']}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ExpandMore /> : <ExpandLess />}
          </button>
        </div>
        {props.type === SlideType.BULLET_LIST && (
          <BulletListConfig
            content={props.content || []}
            captions={props.captions}
            onChange={props.onChange}
          />
        )}
        {props.type === SlideType.LOOK_FORWARD_CHART && (
          <LookForwardChartConfig
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
      </div>
    </div>
  );
};

export default SlideConfig;
