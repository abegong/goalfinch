/**
 * Storage service for persisting application configuration.
 */

export const STORAGE_KEYS = {
  DASHBOARD: 'goalfinch_dashboard',
  CONNECTIONS: 'goalfinch_connections',
  APP: 'goalfinch_app',
} as const;

export interface StorageError extends Error {
  type: 'save' | 'load' | 'clear';
  key?: string;
  originalError: unknown;
}

export interface StorageService {
  /**
   * Save data to storage
   * @param key Storage key
   * @param data Data to store
   * @throws {StorageError} If save fails
   */
  save<T>(key: string, data: T): void;

  /**
   * Load data from storage
   * @param key Storage key
   * @returns Stored data or null if not found
   * @throws {StorageError} If load fails
   */
  load<T>(key: string): T | null;

  /**
   * Clear all stored data
   * @throws {StorageError} If clear fails
   */
  clear(): void;
}

export class LocalStorageService implements StorageService {
  constructor(private readonly notify?: { 
    showError: (message: string) => void;
    showWarning: (message: string) => void;
  }) {}

  private createError(type: 'save' | 'load' | 'clear', originalError: unknown, key?: string): StorageError {
    const error = new Error(
      type === 'save' ? `Failed to save data${key ? ` for key ${key}` : ''}`
      : type === 'load' ? `Failed to load data${key ? ` for key ${key}` : ''}`
      : 'Failed to clear storage'
    ) as StorageError;
    
    error.type = type;
    error.key = key;
    error.originalError = originalError;
    return error;
  }

  save<T>(key: string, data: T): void {
    try {
      // Check if localStorage is available
      if (!window.localStorage) {
        throw new Error('localStorage is not available');
      }

      // Check remaining storage space (rough estimate)
      const serialized = JSON.stringify(data);
      const spaceNeeded = (key.length + serialized.length) * 2; // Unicode characters
      if (spaceNeeded > 5242880) { // 5MB limit
        throw new Error('Data exceeds storage limit');
      }

      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
      
      const storageError = this.createError('save', error, key);
      
      // Show user-friendly error message
      if (this.notify) {
        if (error instanceof Error) {
          if (error.message.includes('storage limit')) {
            this.notify.showError('Unable to save changes: storage is full. Try clearing some data.');
          } else if (error.message.includes('not available')) {
            this.notify.showError('Unable to save changes: storage is not available in private browsing mode.');
          } else {
            this.notify.showError('Unable to save changes. Your data may be lost if you close the app.');
          }
        }
      }
      
      throw storageError;
    }
  }

  load<T>(key: string): T | null {
    try {
      if (!window.localStorage) {
        throw new Error('localStorage is not available');
      }

      const serialized = localStorage.getItem(key);
      if (!serialized) {
        return null;
      }
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      
      const storageError = this.createError('load', error, key);
      
      if (this.notify) {
        if (error instanceof Error) {
          if (error.message.includes('not available')) {
            this.notify.showWarning('Unable to load saved data: storage is not available in private browsing mode.');
          } else {
            this.notify.showWarning('Unable to load saved data. Using default settings.');
          }
        }
      }
      
      throw storageError;
    }
  }

  clear(): void {
    try {
      if (!window.localStorage) {
        throw new Error('localStorage is not available');
      }

      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
      
      const storageError = this.createError('clear', error);
      
      if (this.notify) {
        this.notify.showError('Failed to clear saved data.');
      }
      
      throw storageError;
    }
  }
}
