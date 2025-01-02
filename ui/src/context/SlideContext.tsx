import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Slide } from '../data/slide_interfaces';
import { slideData } from '../data/slide_data';

interface SlideContextType {
  slides: Slide[];
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;
}

const SlideContext = createContext<SlideContextType | undefined>(undefined);

export const SlideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [slides, setSlides] = useState<Slide[]>(slideData);

  return (
    <SlideContext.Provider value={{ slides, setSlides }}>
      {children}
    </SlideContext.Provider>
  );
};

export const useSlides = () => {
  const context = useContext(SlideContext);
  if (context === undefined) {
    throw new Error('useSlides must be used within a SlideProvider');
  }
  return context;
};
