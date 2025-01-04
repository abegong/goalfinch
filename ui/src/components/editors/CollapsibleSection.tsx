import React, { useState } from 'react';
import styles from './CollapsibleSection.module.css';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ 
  title, 
  children 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={styles['collapsible-section']}>
      <div 
        className={styles['section-header']} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles['header-left']}>
          <span className={`${styles['collapse-icon']} ${isExpanded ? styles['expanded'] : ''}`}>
            ▼
          </span>
          <h3>{title}</h3>
        </div>
      </div>
      <div className={`${styles['section-content']} ${isExpanded ? '' : styles['collapsed']}`}>
        {children}
      </div>
    </div>
  );
};
