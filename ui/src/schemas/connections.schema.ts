import { z } from 'zod';

export const sourceConfigSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
});

export const backendConfigSchema = z.object({
  serverUrl: z.string().url(),
  serverPassword: z.string().min(1),
});

export const connectionsConfigSchema = z.object({
  backend: backendConfigSchema.nullable(),
  pictureSources: z.array(sourceConfigSchema),
  dataSources: z.array(sourceConfigSchema),
});

export type ConnectionsConfigSchemaType = z.infer<typeof connectionsConfigSchema>;
