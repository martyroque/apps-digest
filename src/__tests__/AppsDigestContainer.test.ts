import { AppsDigestContainer } from '../AppsDigestContainer';
import { generateStoreDefinition } from '../utils';

const mockDestroy = jest.fn();

class MockStore {
  destroy = mockDestroy;
}

const mockStoreDefinition = generateStoreDefinition(MockStore);

const storeContainer = AppsDigestContainer.getInstance();

describe('AppsDigestContainer tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    storeContainer.remove(mockStoreDefinition);
  });

  describe('get store', () => {
    it('should return the store instance', () => {
      const store = storeContainer.get(mockStoreDefinition);

      expect(store).toBeInstanceOf(MockStore);
    });
  });

  describe('remove store', () => {
    it('should return false when store record was not found', () => {
      expect(storeContainer.remove(mockStoreDefinition)).toBe(false);
    });

    it('should return true when store record was found', () => {
      storeContainer.get(mockStoreDefinition);

      expect(storeContainer.remove(mockStoreDefinition)).toBe(true);
    });

    it('should call destroy the store instance when store has only 1 reference', () => {
      storeContainer.get(mockStoreDefinition);

      storeContainer.remove(mockStoreDefinition);

      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });

    it('should not destroy the store instance when store has more than 1 reference', () => {
      storeContainer.get(mockStoreDefinition);
      storeContainer.get(mockStoreDefinition);

      storeContainer.remove(mockStoreDefinition);

      expect(mockDestroy).not.toHaveBeenCalled();
    });
  });
});
