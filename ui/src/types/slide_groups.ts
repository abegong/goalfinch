/**
 * Type definitions for editor components and their configurations in Goal Finch.
 */

import { SlideType, BulletSlideConfig, ChartSlideConfig, PictureSlideConfig } from './slides';
import { ReactNode } from 'react';


/**
 * Defines the structure for caption text that can appear in different positions on a slide.
 */
export interface Captions {
  top_center?: string;
  bottom_center?: string;
  bottom_right?: string;
  bottom_left?: string;
}

/**
 * Base interface for all editor configurations.
 */
export interface BaseSlideGroupConfig {
  type: SlideType;
  captions: Captions;
}

/**
 * Configuration for bullet-style slides that display a list of text items.
 */
export interface BulletSlideGroupConfig extends BaseSlideGroupConfig {
  type: SlideType.BULLETS;
  slides: BulletSlideConfig[];
}

/**
 * Configuration for chart slides that display data visualizations.
 */
export interface ChartSlideGroupConfig extends BaseSlideGroupConfig {
  type: SlideType.CHART;
  slides: ChartSlideConfig[];
}

/**
 * Configuration for nested chart slides that contain multiple chart configurations.
 */
export interface PictureSlideGroupConfig extends BaseSlideGroupConfig {
  type: SlideType.PICTURE;
  slide_count: number;
}

/**
 * Union type of all possible slide configurations.
 */
export type SlideGroupConfig = 
  | BulletSlideGroupConfig 
  | ChartSlideGroupConfig 
  | PictureSlideGroupConfig;
