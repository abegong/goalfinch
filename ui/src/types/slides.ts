/**
 * Type definitions for slides and slide-related concepts.
 * 
 * 1. `SlideType` is an enum of all possible slide types
 * 2. `slideTypes` is array of all valid slide types.
 * 3. The `BaseSlideConfig` interface defines the structure of a slide config that all specific slide types must implement.
 * 4. The `BulletSlideConfig`, `PictureSlideConfig`, and `ChartSlideConfig` interfaces extend `BaseSlideConfig` with type-specific fields.
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


export interface CsvExtractionConfig {
  date_column: string;
  value_column: string;
  filter_column?: string;
  filter_value?: string;
}

/**
 * Base slide interface that all specific slide types must implement.
 */
export interface BaseSlideConfig {
  type: SlideType;
}

/**
 * A slide that displays a simple bullet list of text items.
 */
export interface BulletSlideConfig extends BaseSlideConfig {
  type: SlideType.BULLETS;
  bullets: string[];
}

/**
 * A slide that displays a data visualization chart.
 */
export interface ChartSlideConfig extends BaseSlideConfig {
  type: SlideType.CHART;

  source: string;
  csv_extraction: CsvExtractionConfig | null;
  goal: number;

  title?: string;
  rounding: number;
  units: string;

  asOfDate?: string;
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
  | PictureSlideConfig;