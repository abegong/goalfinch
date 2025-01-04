import React from 'react';
import { BaseSlideGroupEditorProps, SlideConfig } from './slide_editor_types';
import styles from './SlideGroupEditor.module.css';
import { CollapsibleSection } from './CollapsibleSection';

export function BaseSlideGroupEditor<T extends SlideConfig>({
  config,
  onChange,
  children
}: BaseSlideGroupEditorProps<T>) {
  const handleCaptionChange = (field: keyof T['captions']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaptions = {
      ...config.captions,
      [field]: e.target.value
    };
    onChange({ captions: newCaptions } as Partial<T>);
  };

  return (
    <div className={styles['slide-group-editor']}>
      {children}
      <CollapsibleSection title="Captions">
        <div className={styles['caption-config']}>
          <input
            type="text"
            placeholder="Top Center"
            value={config.captions?.top_center || ''}
            onChange={handleCaptionChange('top_center')}
          />
          <input
            type="text"
            placeholder="Bottom Center"
            value={config.captions?.bottom_center || ''}
            onChange={handleCaptionChange('bottom_center')}
          />
          <input
            type="text"
            placeholder="Bottom Right"
            value={config.captions?.bottom_right || ''}
            onChange={handleCaptionChange('bottom_right')}
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default BaseSlideGroupEditor;
