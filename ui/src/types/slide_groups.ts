/**
 * This file defines the type hierarchy for slide group configurations in Goal Finch.
 * There are three key parts to this system:
 * 
 * 1. BaseSlideGroupConfig - The base interface that all slide group configurations extend from
 * 2. Specific slide group configs (Bullet, Chart, etc.) - Extensions of BaseSlideGroupConfig with type-specific fields
 * 3. SlideGroupConfigType - A type utility for type-safe discrimination of slide group types
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
  name: string;
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
  source: string;
  slides: PictureSlideConfig[];
}

/**
 * Union type of all possible slide configurations.
 */
export type SlideGroupConfig = 
  | PictureSlideGroupConfig
  | BulletSlideGroupConfig 
  | ChartSlideGroupConfig 
;