import React from 'react';
import { Captions } from '../data/slide_data';
import BaseSlideConfig, {CollapsibleSection} from './BaseSlideConfig';
import styles from './SlideConfig.module.css';

interface BulletListConfigProps {
  content: string[];
  captions?: Captions;
  onChange: (config: any) => void;
}

export const BulletListConfig: React.FC<BulletListConfigProps> = ({ content, captions, onChange }) => {
  const handleBulletChange = (index: number, value: string) => {
    const newContent = [...content];
    newContent[index] = value;
    onChange({ content: newContent });
  };

  return (
    <div>
      <CollapsibleSection title="Bullets">
        <div className={styles['bullet-list-config']}>
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
      </CollapsibleSection>
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
    </div>
  );
};

export default BulletListConfig;
