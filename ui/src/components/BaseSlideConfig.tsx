import React, { useState } from 'react';
import { Captions } from '../data/slide_interfaces';
import styles from './SlideConfig.module.css';

interface BaseSlideConfigProps {
  captions?: Captions;
  onChange: (config: any) => void;
}

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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

export { CollapsibleSection };
export default BaseSlideConfig;
