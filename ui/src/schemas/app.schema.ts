import { z } from 'zod';

export const themeSchema = z.object({
  mode: z.enum(['light', 'dark'])
});

export const appControlBarSchema = z.object({
  open: z.boolean(),
  visible: z.boolean()
});

export const appConfigSchema = z.object({
  appControlBar: appControlBarSchema,
  theme: themeSchema
});

export type AppConfigSchemaType = z.infer<typeof appConfigSchema>;