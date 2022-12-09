import { act, renderHook } from '@testing-library/react';

import { AppsDigestValue } from '../AppsDigestValue';
import { generateStoreDefinition } from '../utils';
import { useAppsDigestStore, useAppsDigestValue } from '../hooks';

const mockDestroy = jest.fn();

class MockStore {
  testValue = new AppsDigestValue(1);
  destroy = mockDestroy;
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
      const { unmount, rerender } = renderHook(() =>
        useAppsDigestStore(mockStoreDefinition),
      );

      // trigger some rerenders to ensure a single store reference
      rerender();
      rerender();
      rerender();

      unmount();

      expect(mockDestroy).toHaveBeenCalled();
    });
  });

  describe('useAppsDigestValue', () => {
    let store: MockStore;

    beforeEach(() => {
      const { result } = renderHook(() =>
        useAppsDigestStore(mockStoreDefinition),
      );
      store = result.current;
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
      const { result, unmount, rerender } = renderHook(() =>
        useAppsDigestValue(store.testValue),
      );

      act(() => {
        store.testValue.publish(2);
      });

      // trigger some rerenders to ensure a single subscription
      rerender();
      rerender();
      rerender();

      unmount();

      act(() => {
        store.testValue.publish(3);
      });

      expect(result.current).toBe(2);
    });
  });
});
