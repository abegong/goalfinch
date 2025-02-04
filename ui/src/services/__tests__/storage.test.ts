import { LocalStorageService, STORAGE_KEYS } from '../storage';

describe('LocalStorageService', () => {
  let storage: LocalStorageService;
  
  beforeEach(() => {
    localStorage.clear();
    storage = new LocalStorageService();
  });

  it('should save and load data with versioning', () => {
    const testData = { test: 'data' };
    storage.save(STORAGE_KEYS.APP, testData);
    const loaded = storage.load(STORAGE_KEYS.APP);
    expect(loaded).toEqual(testData);

    // Verify that data is stored with version
    const rawStored = localStorage.getItem(STORAGE_KEYS.APP);
    const parsed = JSON.parse(rawStored!);
    expect(parsed).toHaveProperty('version', 1);
    expect(parsed).toHaveProperty('data', testData);
  });

  it('should handle unversioned legacy data', () => {
    const legacyData = { test: 'legacy' };
    localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(legacyData));
    const loaded = storage.load(STORAGE_KEYS.APP);
    expect(loaded).toEqual(legacyData);
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
    }).toThrow('Unexpected token \'i\', "invalid json" is not valid JSON');
  });

  it('should reject unknown versions', () => {
    const futureVersionData = {
      version: 999,
      data: { test: 'future' }
    };
    localStorage.setItem(STORAGE_KEYS.APP, JSON.stringify(futureVersionData));
    
    expect(() => {
      storage.load(STORAGE_KEYS.APP);
    }).toThrow('Unknown data version: 999');
  });
});
