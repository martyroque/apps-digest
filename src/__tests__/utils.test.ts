import { generateStoreDefinition } from '../utils';

describe('utils tests', () => {
  describe('generateStoreDefinition', () => {
    it('should generate a store definition', () => {
      const expectedStoreName = 'MockStore';
      class MockStore {
        public static getStoreName() {
          return expectedStoreName;
        }
      }
      const storeDefinition = generateStoreDefinition(MockStore);

      expect(storeDefinition).toEqual({
        name: expectedStoreName,
        Class: MockStore,
      });
    });
  });
});
