import { z } from 'zod';
import { STORAGE_KEYS } from '../constants';
import { appConfigSchema } from '../schemas/app.schema';
import { dashboardConfigSchema } from '../schemas/dashboard.schema';
import { connectionsConfigSchema } from '../schemas/connections.schema';

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: z.ZodError,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

const schemaMap = {
  [STORAGE_KEYS.APP]: appConfigSchema,
  [STORAGE_KEYS.DASHBOARD]: dashboardConfigSchema,
  [STORAGE_KEYS.CONNECTIONS]: connectionsConfigSchema,
} as const;

export function validateStorageData<T>(key: string, data: T): T {
  const schema = schemaMap[key as keyof typeof schemaMap];
  
  if (!schema) {
    // If we don't have a schema for this key, assume the data is valid
    return data;
  }

  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(
        `Invalid data for ${key}: ${error.errors.map(e => e.message).join(', ')}`,
        error
      );
    }
    throw error;
  }
}
