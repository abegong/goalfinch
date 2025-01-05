import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import styles from './SlideGroupEditor.module.css';
import { BulletSlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig } from '../../types/slides';

interface BulletEditorProps {
  config: BulletSlideGroupConfig;
  onChange: (config: Partial<BulletSlideGroupConfig>) => void;
}

export const BulletEditor: React.FC<BulletEditorProps> = ({
  config,
  onChange,
}) => {
  const handleSlideChange = (index: number, update: Partial<BulletSlideConfig>) => {
    const newSlides = [...(config.slides || [])];
    newSlides[index] = { ...newSlides[index], ...update };
    onChange({ slides: newSlides });
  };

  return (
    <div>
      {config.slides.map((slideConfig, index) => (
        <BulletSlideEditor
          key={index}
          config={slideConfig}
          onChange={(update) => handleSlideChange(index, update)}
        />
      ))}
    </div>
  );
};

interface BulletSlideEditorProps {
  config: BulletSlideConfig;
  onChange: (config: Partial<BulletSlideConfig>) => void;
}

export const BulletSlideEditor: React.FC<BulletSlideEditorProps> = ({
  config,
  onChange,
}) => {
  const handleBulletChange = (index: number, value: string) => {
    const newContent = [...(config.content || [])];
    newContent[index] = value;
    onChange({ content: newContent });
  };

  const handleDeleteBullet = (index: number) => {
    const newContent = (config.content || []).filter((_, i) => i !== index);
    onChange({ content: newContent });
    
    // If we just deleted the last bullet, focus the new last bullet
    if (index === (config.content || []).length - 1 && index > 0) {
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
      const newContent = [...(config.content || [])];
      newContent.splice(index + 1, 0, '');
      onChange({ content: newContent });
      // Focus the new input after React re-renders
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
        const nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && (config.content || [])[index] === '') {
      e.preventDefault();
      if ((config.content || []).length > 1) {
        handleDeleteBullet(index);
      }
    }
  };

  return (
    <CollapsibleSection title="Bullet List">
      <div className={styles['bullet-list']}>
        {(config.content || []).map((bullet, index) => (
          <div key={index} className={styles['bullet-row']}>
            <input
              type="text"
              value={bullet}
              onChange={(e) => handleBulletChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              placeholder={`Bullet ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};

export default BulletEditor;
