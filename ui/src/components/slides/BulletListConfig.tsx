import React from 'react';
import { Captions } from '../../data/slide_interfaces';
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

  const handleDeleteBullet = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    onChange({ content: newContent });
    
    // If we just deleted the last bullet, focus the new last bullet
    if (index === content.length - 1 && index > 0) {
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
      const newContent = [...content];
      newContent.splice(index + 1, 0, '');
      onChange({ content: newContent });
      // Focus the new input after React re-renders
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
        const nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && content[index] === '') {
      e.preventDefault();
      handleDeleteBullet(index);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
      const targetIndex = e.shiftKey ? index - 1 : index + 1;
      const targetInput = inputs[targetIndex] as HTMLInputElement;
      if (targetInput) {
        targetInput.focus();
        // Move cursor to end of input
        const len = targetInput.value.length;
        targetInput.setSelectionRange(len, len);
      }
    }
  };

  return (
    <div>
      <CollapsibleSection title="Bullets">
        <div className={styles['bullet-list-config']}>
          {content.map((bullet, index) => (
            <div key={index} className={styles['bullet-row']}>
              <input
                type="text"
                value={bullet}
                onChange={(e) => handleBulletChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
              <button 
                onClick={() => handleDeleteBullet(index)}
                className={styles['delete-button']}
                aria-label="Delete bullet"
              >
                ×
              </button>
            </div>
          ))}
          <button onClick={() => onChange({ content: [...content, ''] })}>Add Bullet</button>
        </div>
      </CollapsibleSection>
      <BaseSlideConfig captions={captions} onChange={(newCaptions) => onChange({ captions: newCaptions })} />
    </div>
  );
};

export default BulletListConfig;
