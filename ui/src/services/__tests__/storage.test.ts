import { LocalStorageService } from '../storage';
import { STORAGE_KEYS } from '../../constants';

describe('LocalStorageService', () => {
  let storage: LocalStorageService;
  
  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageService();
  });

  const validAppConfig = {
    appControlBar: {
      open: true,
      visible: true
    },
    theme: {
      mode: 'light' as const
    }
  };

  const validDashboardConfig = {
    slideGroups: []
  };

  it('should save and load data with versioning', () => {
    storage.save(STORAGE_KEYS.APP, validAppConfig);
    const loaded = storage.load(STORAGE_KEYS.APP);
    expect(loaded).toEqual(validAppConfig);

    // Verify that data is stored with version
    const rawStored = localStorage.getItem(STORAGE_KEYS.APP);
    const parsed = JSON.parse(rawStored!);
    expect(parsed).toHaveProperty('version', 1);
    expect(parsed).toHaveProperty('data', validAppConfig);
  });

  it('should handle unversioned legacy data', () => {
    localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(validAppConfig));
    const loaded = storage.load(STORAGE_KEYS.APP);
    expect(loaded).toEqual(validAppConfig);
  });

  it('should return null for non-existent data', () => {
    const loaded = storage.load(STORAGE_KEYS.DASHBOARD);
    expect(loaded).toBeNull();
  });

  it('should clear all stored data', () => {
    storage.save(STORAGE_KEYS.APP, validAppConfig);
    storage.save(STORAGE_KEYS.DASHBOARD, validDashboardConfig);
    
    storage.clear();
    
    expect(storage.load(STORAGE_KEYS.APP)).toBeNull();
    expect(storage.load(STORAGE_KEYS.DASHBOARD)).toBeNull();
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem(STORAGE_KEYS.APP, 'invalid json');
    
    expect(() => {
      storage.load(STORAGE_KEYS.APP);
    }).toThrow('Unexpected token \'i\', "invalid json" is not valid JSON');
  });

  it('should reject unknown versions', () => {
    const futureVersionData = {
      version: 999,
      data: validAppConfig
    };
    localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(futureVersionData));
    
    expect(() => {
      storage.load(STORAGE_KEYS.APP);
    }).toThrow('Unknown data version: 999');
  });
});
