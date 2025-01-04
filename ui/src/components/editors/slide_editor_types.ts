/**
 * This file defines the type hierarchy for slide configurations in Goal Finch.
 * There are three key parts to this system:
 * 
 * 1. BaseSlideConfig - The base interface that all slide configurations extend from
 * 2. Specific slide configs (Bullet, Chart, etc.) - Extensions of BaseSlideConfig with type-specific fields
 * 3. SlideConfigType - A type utility for type-safe discrimination of slide types
 */

import { Captions } from '../../data/slide_interfaces';

/**
 * Base interface that defines common properties that all slide configurations must have.
 * Currently this is just captions, but any future properties that should exist across
 * all slide types should be added here.
 */
export interface BaseSlideConfig {
  captions: Captions;
}

/** Configuration for bullet-style slides that display a list of text items */
export interface BulletSlideConfig extends BaseSlideConfig {
  type: 'bullet';
  content: string[];
}

/** Configuration for chart slides that display data visualizations */
export interface ChartSlideConfig extends BaseSlideConfig {
  type: 'chart';
  url: string;
  goal: number;
  rounding: number;
  units: string;
}

/** Configuration for nested chart slides that can contain multiple chart configurations */
export interface NestedChartsSlideConfig extends BaseSlideConfig {
  type: 'nested-charts';
  content: ChartSlideConfig[];
}

/** Union type of all possible slide configurations. Used for type-safe handling of any slide type */
export type SlideConfig = BulletSlideConfig | ChartSlideConfig | NestedChartsSlideConfig;

/**
 * Type utility that maps a specific SlideConfig type to its corresponding string type literal.
 * This enables type-safe discrimination of slide types. For example:
 * - If T is BulletSlideConfig, then SlideConfigType<T> resolves to 'bullet'
 * - If T is ChartSlideConfig, then SlideConfigType<T> resolves to 'chart'
 * - If T is NestedChartsSlideConfig, then SlideConfigType<T> resolves to 'nested-charts'
 */
export type SlideConfigType<T extends SlideConfig> = T extends BulletSlideConfig ? 'bullet'
  : T extends ChartSlideConfig ? 'chart'
  : T extends NestedChartsSlideConfig ? 'nested-charts'
  : never;

/** Props interface for the base slide group editor component */
export interface BaseSlideGroupEditorProps<T extends SlideConfig> {
  config: T;
  onChange: (config: Partial<T>) => void;
  children?: React.ReactNode;
}

/** Props interface for specific slide editor components */
export interface SlideEditorProps<T extends SlideConfig> {
  config: T;
  onChange: (config: Partial<T>) => void;
}
