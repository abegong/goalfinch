import React, { useState, useEffect } from 'react';
import { SlideType, Captions } from '../data/slide_data';
import { 
  FormatListBulleted, 
  Landscape, 
  ShowChart, 
  List, 
  Timeline,
  Delete,
  Build,
} from '@mui/icons-material';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import styles from './SlideConfig.module.css';
import clsx from 'clsx';

interface BaseSlideConfigProps {
  captions?: Captions;
  onChange: (config: any) => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div className={styles['collapsible-section']}>
      <div 
        className={styles['section-header']} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles['header-left']}>
          <span className={`${styles['collapse-icon']} ${isExpanded ? styles['expanded'] : ''}`}>▼</span>
          <h3>{title}</h3>
        </div>
      </div>
      <div className={`${styles['section-content']} ${isExpanded ? '' : styles['collapsed']}`}>
        {children}
      </div>
    </div>
  );
};

export const BaseSlideConfig: React.FC<BaseSlideConfigProps> = ({ captions, onChange }) => {
  return (
    <div className={styles['slide-config']}>
      <CollapsibleSection title="Captions">
        <div className={styles['caption-config']}>
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
      </CollapsibleSection>
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
      <CollapsibleSection title="Chart Settings">
        <div className={styles['form-grid']}>
          <label htmlFor="data-url">Data URL</label>
          <input
            id="data-url"
            type="text"
            value={url}
            onChange={(e) => onChange({ url: e.target.value })}
          />
          <label htmlFor="goal-value">Goal</label>
          <input
            id="goal-value"
            type="number"
            value={goal}
            onChange={(e) => onChange({ goal: parseFloat(e.target.value) })}
          />
          <label htmlFor="rounding-digits">Decimals</label>
          <input
            id="rounding-digits"
            type="number"
            min="0"
            value={rounding}
            onChange={(e) => onChange({ rounding: parseInt(e.target.value) })}
          />
          <label htmlFor="units-label">Units</label>
          <input
            id="units-label"
            type="text"
            value={units}
            onChange={(e) => onChange({ units: e.target.value })}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
};

interface NestedChartsConfigProps extends BaseSlideConfigProps {
  content: any[];
}

export const NestedChartsConfig: React.FC<NestedChartsConfigProps> = ({ content, captions, onChange }) => {
  return (
    <div>
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
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
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
      return 'Gallery';
    case SlideType.NESTED_CHARTS:
      return 'Nested Charts';
    case SlideType.NESTED_BULLET_LIST:
      return 'Nested Bullet List';
    case SlideType.LOOK_FORWARD_CHART:
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
  SlideType.LOOK_FORWARD_CHART,
];

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
      <SpeedDial
        ariaLabel="Change slide type"
        icon={<SpeedDialIcon openIcon={<Build />} icon={<Build />} />}
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
