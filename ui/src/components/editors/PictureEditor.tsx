import React from 'react';
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
    <div></div>
  );
};

export default PictureEditor;
