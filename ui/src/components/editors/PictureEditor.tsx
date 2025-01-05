import React from 'react';
import { CollapsibleSection } from './CollapsibleSection';
import { PictureSlideConfig } from '../../types/slides';
import styles from './SlideGroupEditor.module.css';

interface PictureEditorProps {
  config: PictureSlideConfig;
  onChange: (config: Partial<PictureSlideConfig>) => void;
}

export const PictureEditor: React.FC<PictureEditorProps> = ({
  config,
  onChange,
}) => {
  return (
    <CollapsibleSection title="Picture">
      <div></div>
    </CollapsibleSection>
  );
};

export default PictureEditor;
