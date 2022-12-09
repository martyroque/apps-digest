import { nanoid } from 'nanoid';

import { generateStoreDefinition } from '../utils';

jest.mock('nanoid');

const mockStoreId = 'QAqQDsM9iwcMnZl7TyAnv';
jest.mocked(nanoid).mockReturnValue(mockStoreId);

describe('utils tests', () => {
  describe('generateStoreDefinition', () => {
    it('should generate a store definition', () => {
      class MockStore {
        destroy = jest.fn();
      }
      const storeDefinition = generateStoreDefinition(MockStore);

      expect(storeDefinition).toEqual({
        storeId: mockStoreId,
        storeClass: MockStore,
      });
    });
  });
});
