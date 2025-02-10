import { z } from 'zod';
import { slideGroupSchema } from './slides.schema';

export const dashboardConfigSchema = z.object({
  slideGroups: z.array(slideGroupSchema),
});

export type DashboardConfigSchemaType = z.infer<typeof dashboardConfigSchema>;
