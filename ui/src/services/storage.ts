/**
 * Storage service for persisting application configuration.
 */

export const STORAGE_KEYS = {
  DASHBOARD: 'goalfinch_dashboard',
  CONNECTIONS: 'goalfinch_connections',
  APP: 'goalfinch_app',
} as const;

export interface StorageService {
  /**
   * Save data to storage
   * @param key Storage key
   * @param data Data to store
   */
  save<T>(key: string, data: T): void;

  /**
   * Load data from storage
   * @param key Storage key
   * @returns Stored data or null if not found
   */
  load<T>(key: string): T | null;

  /**
   * Clear all stored data
   */
  clear(): void;
}

export class LocalStorageService implements StorageService {
  save<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
    }
  }

  load<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) {
        return null;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      return null;
    }
  }

  clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}
