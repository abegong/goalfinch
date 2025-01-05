/**
 * Type definitions for slides and slide-related concepts.
 */


/**
 * Enumeration of all possible slide types supported by Goal Finch.
 */
export enum SlideType {
  BULLETS = "bullets",
  PICTURE = "picture",
  CHART = "chart",
}

export const slideTypes = [
  SlideType.BULLETS,
  SlideType.PICTURE,
  SlideType.CHART,
]

/**
 * Interface for the content of a chart slide.
 */
export interface ChartSlideContent {
  url: string;
  goal: number;
  rounding: number;
  units: string;
}

/**
 * Base slide interface that all specific slide types must implement.
 */
export interface BaseSlideConfig {
  type: SlideType;
  content?: unknown;
}

/**
 * A slide that displays a simple bullet list of text items.
 */
export interface BulletSlideConfig extends BaseSlideConfig {
  type: SlideType.BULLETS;
  content: string[];
}

/**
 * A slide that displays a data visualization chart.
 */
export interface ChartSlideConfig extends BaseSlideConfig {
  type: SlideType.CHART;
  content: ChartSlideContent;
}

/**
 * A slide that contains multiple nested images.
 */
export interface PictureSlideConfig extends BaseSlideConfig {
  type: SlideType.PICTURE;
}

/**
 * Union type of all possible slide types for type-safe handling.
 */
export type SlideConfig = 
  | BulletSlideConfig 
  | ChartSlideConfig
  | PictureSlideConfig