import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SlideGroupConfig } from '../types/slide_groups';
import { demoData } from '../data/demo_data';

interface SlideContextType {
  slideGroups: SlideGroupConfig[];
  setSlideGroups: React.Dispatch<React.SetStateAction<SlideGroupConfig[]>>;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const SlideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [slideGroups, setSlideGroups] = useState<SlideGroupConfig[]>(demoData);

  return (
    <SlideContext.Provider value={{ slideGroups, setSlideGroups }}>
      {children}
    </SlideContext.Provider>
  );
};

export const useSlideGroups = () => {
  const context = useContext(SlideContext);
  if (context === undefined) {
    throw new Error('useSlideGroups must be used within a SlideProvider');
  }
  return context;
};
