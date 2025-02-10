import { ValidationError, validateStorageData } from './validation';
import { STORAGE_KEYS } from '../constants';

/**
 * Storage service for persisting application configuration.
 */

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

// Version format for stored data
interface VersionedData<T> {
  version: number;
  data: T;
}

export class LocalStorageService implements StorageService {
  private readonly CURRENT_VERSION = 1;

  constructor(private readonly notify?: { 
    showError: (message: string) => void;
    showWarning: (message: string) => void;
  }) {}

  private createError(type: 'save' | 'load' | 'clear', originalError: unknown, key?: string): StorageError {
    let message = '';
    
    if (originalError instanceof Error) {
      message = originalError.message;
    } else {
      message = type === 'save' ? `Failed to save data${key ? ` for key ${key}` : ''}`
        : type === 'load' ? `Failed to load data${key ? ` for key ${key}` : ''}`
        : 'Failed to clear storage';
    }
    
    const error = new Error(message) as StorageError;
    error.type = type;
    error.key = key;
    error.originalError = originalError;
    return error;
  }

  private migrateData<T>(versionedData: VersionedData<T>): T {
    // Add migrations as needed when data format changes
    switch (versionedData.version) {
      case 1:
        return versionedData.data;
      default:
        throw new Error(`Unknown data version: ${versionedData.version}`);
    }
  }

  save<T>(key: string, data: T): void {
    try {
      // Check if localStorage is available
      if (!window.localStorage) {
        throw new Error('localStorage is not available');
      }

      // Validate data before saving
      const validatedData = validateStorageData(key, data);

      // Wrap data with version
      const versionedData: VersionedData<T> = {
        version: this.CURRENT_VERSION,
        data: validatedData
      };

      // Check remaining storage space (rough estimate)
      const serialized = JSON.stringify(versionedData);
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
            this.notify.showWarning('Unable to save changes: storage is not available in private browsing mode.');
          } else {
            this.notify.showError('Failed to save changes. Please try again.');
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

      const parsed = JSON.parse(serialized);
      
      // Handle both versioned and unversioned data for backward compatibility
      let data: T;
      if (parsed && typeof parsed === 'object' && 'version' in parsed && 'data' in parsed) {
        data = this.migrateData(parsed as VersionedData<T>);
      } else {
        // If data is not versioned, treat it as version 1
        data = parsed as T;
      }

      // Validate loaded data
      return validateStorageData(key, data);
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      
      const storageError = this.createError('load', error, key);
      
      if (this.notify) {
        if (error instanceof ValidationError) {
          this.notify.showError(`Invalid data in storage: ${error.message}`);
        } else if (error instanceof Error) {
          if (error.message.includes('not available')) {
            this.notify.showWarning('Unable to load data: storage is not available in private browsing mode.');
          } else {
            this.notify.showError('Failed to load data. Please try again.');
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
