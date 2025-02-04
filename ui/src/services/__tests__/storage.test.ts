import { LocalStorageService, STORAGE_KEYS } from '../storage';

describe('LocalStorageService', () => {
  let storage: LocalStorageService;
  
  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageService();
  });

  it('should save and load data', () => {
    const testData = { test: 'data' };
    storage.save(STORAGE_KEYS.APP, testData);
    const loaded = storage.load(STORAGE_KEYS.APP);
    expect(loaded).toEqual(testData);
  });

  it('should return null for non-existent data', () => {
    const loaded = storage.load(STORAGE_KEYS.DASHBOARD);
    expect(loaded).toBeNull();
  });

  it('should clear all stored data', () => {
    storage.save(STORAGE_KEYS.APP, { test: 'data' });
    storage.save(STORAGE_KEYS.DASHBOARD, { test: 'data2' });
    
    storage.clear();
    
    expect(storage.load(STORAGE_KEYS.APP)).toBeNull();
    expect(storage.load(STORAGE_KEYS.DASHBOARD)).toBeNull();
  });

  it('should handle invalid JSON gracefully', () => {
    localStorage.setItem(STORAGE_KEYS.APP, 'invalid json');
    
    expect(() => {
      storage.load(STORAGE_KEYS.APP);
    }).toThrow('Failed to load data for key goalfinch_app');
  });
});
