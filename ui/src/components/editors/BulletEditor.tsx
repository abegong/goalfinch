import React, { useState } from 'react';
import styles from './SlideGroupEditor.module.css';
import { BulletSlideGroupConfig } from '../../types/slide_groups';
import { BulletSlideConfig } from '../../types/slides';
import { DragIndicator } from '@mui/icons-material';

interface BulletEditorProps {
  config: BulletSlideGroupConfig;
  selectedSlideIndex: number;
  onChange: (config: Partial<BulletSlideGroupConfig>) => void;
}

export const BulletEditor: React.FC<BulletEditorProps> = ({
  config,
  selectedSlideIndex,
  onChange,
}) => {
  const handleSlideChange = (update: Partial<BulletSlideConfig>) => {
    const newSlides = [...(config.slides || [])];
    newSlides[selectedSlideIndex] = { ...newSlides[selectedSlideIndex], ...update };
    onChange({ slides: newSlides });
  };

  // If there are no slides, don't render anything
  if (!config.slides?.length) {
    return null;
  }

  const selectedSlide = config.slides[selectedSlideIndex];

  return (
    <div>
      <BulletSlideEditor
        config={selectedSlide}
        onChange={handleSlideChange}
      />
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleBulletChange = (index: number, value: string) => {
    const newContent = [...(config.bullets || [])];
    newContent[index] = value;
    onChange({ bullets: newContent });
  };

  const handleDeleteBullet = (index: number) => {
    const newContent = (config.bullets || []).filter((_, i) => i !== index);
    onChange({ bullets: newContent });
    
    // If we just deleted the last bullet, focus the new last bullet
    if (index === (config.bullets || []).length - 1 && index > 0) {
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
      const newContent = [...(config.bullets || [])];
      newContent.splice(index + 1, 0, '');
      onChange({ bullets: newContent });
      // Focus the new input after React re-renders
      setTimeout(() => {
        const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
        const nextInput = inputs[index + 1] as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
    } else if ((e.key === 'Backspace' || e.key === 'Delete') && (config.bullets || [])[index] === '') {
      e.preventDefault();
      if ((config.bullets || []).length > 1) {
        handleDeleteBullet(index);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newBullets = [...(config.bullets || [])];
    const [draggedItem] = newBullets.splice(draggedIndex, 1);
    newBullets.splice(dropIndex, 0, draggedItem);
    onChange({ bullets: newBullets });
    setDraggedIndex(null);
  };

  return (
    <div className={styles['bullet-list']}>
      {(config.bullets || []).map((bullet, index) => (
        <div 
          key={index} 
          className={styles['bullet-row']}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <div className={styles['drag-handle']}>
            <DragIndicator />
          </div>
          <input
            type="text"
            value={bullet}
            onChange={(e) => handleBulletChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            placeholder="Enter bullet point text"
          />
          <button
            type="button"
            onClick={() => handleDeleteBullet(index)}
            className={styles['delete-button']}
            title="Delete bullet point"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const newContent = [...(config.bullets || []), ''];
          onChange({ bullets: newContent });
          // Focus the new input after React re-renders
          setTimeout(() => {
            const inputs = document.querySelectorAll(`.${styles['bullet-row']} input`);
            const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
            if (lastInput) lastInput.focus();
          }, 0);
        }}
        className={styles['add-button']}
        title="Add bullet point"
      >
        +
      </button>
    </div>
  );
};

export default BulletEditor;
