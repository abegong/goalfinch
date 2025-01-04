import React from 'react';
import { Captions } from '../../data/slide_interfaces';
import styles from './SlideGroupEditor.module.css';
import { CollapsibleSection } from './CollapsibleSection';

interface BaseSlideGroupEditorProps {
  captions?: Captions;
  onChange: (config: any) => void;
}

export const BaseSlideGroupEditor: React.FC<BaseSlideGroupEditorProps> = ({ captions, onChange }) => {
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
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default BaseSlideGroupEditor;
