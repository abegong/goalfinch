/**
 * Core configuration types for Goal Finch.
 */

import { SlideGroupConfig } from './slide_groups';

/**
 * Configuration for the main dashboard view of Goal Finch.
 * Contains all information necessary to populate slide groups.
 * Some local, non-persisted state is maintained by the Dashboard.
 * This config is persisted in local storage and optionally synced with
 * the self-hosted backend when available.
 */
export interface DashboardConfig {
  slideGroups: SlideGroupConfig[];
}

/**
 * Application-wide UI preferences and settings.
 * Manages global UI state like control bar visibility and theme settings.
 */
export interface AppConfig {
  appControlBar: {
    open: boolean;
    visible: boolean;
  };
  theme: {
    mode: 'light' | 'dark';
  };
}
