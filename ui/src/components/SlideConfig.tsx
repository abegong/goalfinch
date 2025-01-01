import React, { useState } from 'react';
import { SlideType, Captions } from '../data/slide_data';
import { 
  FormatListBulleted, 
  Landscape, 
  ShowChart, 
  List, 
  Timeline,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import styles from './SlideConfig.module.css';

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

const SlideConfig: React.FC<SlideConfigProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const renderConfig = () => {
    switch (props.type) {
      case SlideType.BULLET_LIST:
        return (
          <BulletListConfig
            content={props.content || []}
            captions={props.captions}
            onChange={props.onChange}
          />
        );
      case SlideType.LOOK_FORWARD_CHART:
        return (
          <LookForwardChartConfig
            url={props.url || ''}
            goal={props.goal || 0}
            rounding={props.rounding || 0}
            units={props.units || ''}
            captions={props.captions}
            onChange={props.onChange}
          />
        );
      case SlideType.NESTED_CHARTS:
        return (
          <NestedChartsConfig
            content={props.content || []}
            captions={props.captions}
            onChange={props.onChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles['slide-config-card']}>
      <div 
        className={styles['slide-config-header']} 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className={styles['slide-type-icon']}>
          {getSlideIcon(props.type)}
        </div>
        <div className={styles['slide-type-text']}>
          {props.type}
        </div>
        {isCollapsed ? <ExpandMore /> : <ExpandLess />}
      </div>
      {!isCollapsed && (
        <div className={styles['slide-config-content']}>
          {renderConfig()}
        </div>
      )}
    </div>
  );
};

export default SlideConfig;
