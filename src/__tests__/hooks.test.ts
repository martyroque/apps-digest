import { act, renderHook } from '@testing-library/react-hooks';

import { AppsDigestValue } from '../AppsDigestValue';
import { useAppsDigestStore, useAppsDigestValue } from '../hooks';
import { AppsDigestContainer } from '../AppsDigestContainer';
import { generateStoreDefinition } from '../utils';

const storeContainer = AppsDigestContainer.getInstance();

const mockDestroy = jest.fn();

class MockStore {
  testValue = new AppsDigestValue(1);
  destroy = mockDestroy;
  public static getStoreName() {
    return 'MockStore';
  }
}

const mockStoreDefinition = generateStoreDefinition(MockStore);

describe('AppsDigest hooks tests', () => {
  describe('useAppsDigestStore', () => {
    it('should return the store instance', () => {
      const { result } = renderHook(() =>
        useAppsDigestStore(mockStoreDefinition),
      );

      expect(result.current).toBeInstanceOf(MockStore);
    });

    it('should remove the store instance', () => {
      const { unmount } = renderHook(() =>
        useAppsDigestStore(mockStoreDefinition),
      );

      unmount();

      expect(mockDestroy).toHaveBeenCalled();
    });
  });

  describe('useAppsDigestValue', () => {
    let store: MockStore;

    beforeEach(() => {
      store = storeContainer.get(mockStoreDefinition);
    });

    afterEach(() => {
      storeContainer.remove(mockStoreDefinition);
    });

    it('should return the initial value', () => {
      const { result } = renderHook(() => useAppsDigestValue(store.testValue));

      expect(result.current).toBe(1);
    });

    it('should subscribe to the value', () => {
      const { result } = renderHook(() => useAppsDigestValue(store.testValue));

      act(() => {
        store.testValue.publish(2);
      });

      expect(result.current).toBe(2);
    });

    it('should unsubscribe from the value when unmounted', () => {
      const { result, unmount } = renderHook(() =>
        useAppsDigestValue(store.testValue),
      );

      act(() => {
        store.testValue.publish(2);
      });

      unmount();

      act(() => {
        store.testValue.publish(3);
      });

      expect(result.current).toBe(2);
    });
  });
});
