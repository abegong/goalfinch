import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { BaseSlideGroupEditor } from './BaseSlideGroupEditor';
import { BulletSlideConfig, SlideEditorProps } from './slide_editor_types';
import styles from './SlideGroupEditor.module.css';

export const BulletSlideGroupEditor: React.FC<SlideEditorProps<BulletSlideConfig>> = ({
  config,
  onChange,
}) => {
  const handleBulletChange = (index: number, value: string) => {
    const newContent = [...config.content];
    newContent[index] = value;
    onChange({ ...config, content: newContent });
  };

  const handleDeleteBullet = (index: number) => {
    const newContent = config.content.filter((_, i) => i !== index);
    onChange({ ...config, content: newContent });
    
    // If we just deleted the last bullet, focus the new last bullet
    if (index === config.content.length - 1 && index > 0) {
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
        const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
        if (lastInput) {
          lastInput.focus();
          const len = lastInput.value.length;
          lastInput.setSelectionRange(len, len);
        }
      }, 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newContent = [...config.content];
      newContent.splice(index + 1, 0, '');
      onChange({ ...config, content: newContent });
      // Focus the new input after React re-renders
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
        const nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && config.content[index] === '') {
      e.preventDefault();
      if (config.content.length > 1) {
        handleDeleteBullet(index);
      }
    }
  };

  return (
    <BaseSlideGroupEditor<BulletSlideConfig> config={config} onChange={onChange}>
      <CollapsibleSection title="Bullets">
        <div className={styles['bullet-list-config']}>
          {config.content.map((bullet, index) => (
            <div key={index} className={styles['bullet-row']}>
              <input
                type="text"
                value={bullet}
                onChange={(e) => handleBulletChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
              <button
                onClick={() => handleDeleteBullet(index)}
                disabled={config.content.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange({ ...config, content: [...config.content, ''] })}
          >
            Add Bullet
          </button>
        </div>
      </CollapsibleSection>
    </BaseSlideGroupEditor>
  );
};

export default BulletSlideGroupEditor;
