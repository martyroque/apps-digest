import { generateStoreDefinition } from '../utils';

describe('utils tests', () => {
  describe('generateStoreDefinition', () => {
    it('should generate a store definition', () => {
      class MockStore {}
      const storeDefinition = generateStoreDefinition(MockStore);

      expect(storeDefinition).toEqual({
        name: 'MockStore',
        Class: MockStore,
      });
    });
  });
});
