/**
 * Core configuration types for Goal Finch.
 */

import { SlideGroupConfig } from './slide_groups';
import { ConnectionsConfig } from './connections';

export interface DashboardConfig {
  slideGroups: SlideGroupConfig[];
  /** Index of the currently active slide within the current slide group */
  activeSlideIndex: number;
}

export interface AppConfig {
  appControlBar: {
    open: boolean;
    visible: boolean;
  };
  theme: {
    mode: 'light' | 'dark';
  };
}
