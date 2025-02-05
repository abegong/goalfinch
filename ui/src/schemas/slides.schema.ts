import { z } from 'zod';
import { SlideType } from '../types/slides';

export const captionsSchema = z.object({
  top_center: z.string().optional(),
  bottom_center: z.string().optional(),
  bottom_right: z.string().optional(),
  bottom_left: z.string().optional(),
});

export const bulletSlideSchema = z.object({
  type: z.literal(SlideType.BULLETS),
  bullets: z.array(z.string()),
});

export const chartSlideSchema = z.object({
  type: z.literal(SlideType.CHART),
  source: z.string(),
  goal: z.number(),
  rounding: z.number().int().min(0),
  units: z.string(),
  title: z.string().optional(),
  asOfDate: z.string().optional(),
});

export const pictureSlideSchema = z.object({
  type: z.literal(SlideType.PICTURE),
});

export const slideSchema = z.discriminatedUnion('type', [
  bulletSlideSchema,
  chartSlideSchema,
  pictureSlideSchema,
]);

export const baseSlideGroupSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(SlideType),
  captions: captionsSchema,
});

export const bulletSlideGroupSchema = baseSlideGroupSchema.extend({
  type: z.literal(SlideType.BULLETS),
  slides: z.array(bulletSlideSchema),
});

export const chartSlideGroupSchema = baseSlideGroupSchema.extend({
  type: z.literal(SlideType.CHART),
  slides: z.array(chartSlideSchema),
});

export const pictureSlideGroupSchema = baseSlideGroupSchema.extend({
  type: z.literal(SlideType.PICTURE),
  source: z.string(),
  slide_count: z.number().int().min(1),
  slides: z.array(pictureSlideSchema),
});

export const slideGroupSchema = z.discriminatedUnion('type', [
  bulletSlideGroupSchema,
  chartSlideGroupSchema,
  pictureSlideGroupSchema,
]);

export type SlideGroupSchemaType = z.infer<typeof slideGroupSchema>;
