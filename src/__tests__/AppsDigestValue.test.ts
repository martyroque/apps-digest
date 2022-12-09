import { nanoid } from 'nanoid';
import { AppsDigestValue } from '../AppsDigestValue';

jest.mock('nanoid');

const mockSubId = 'DYyib2HcqrjvrUm2k6ssU';
jest.mocked(nanoid).mockReturnValue(mockSubId);

const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

describe('AppsDigestValue tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('currentValue tests', () => {
    it('should get the current value', () => {
      const initialValue = 'test value';
      const value = new AppsDigestValue(initialValue);

      expect(value.currentValue()).toBe(initialValue);
    });
  });

  describe('publish tests', () => {
    it('should return false when publishing the same value', () => {
      const value = new AppsDigestValue(2);

      expect(value.publish(2)).toBe(false);
    });

    it('should return true when publishing a different value', () => {
      const value = new AppsDigestValue('');

      expect(value.publish('test')).toBe(true);
    });

    describe('persistency on publish tests', () => {
      it('should persist the new value if persist key is defined', () => {
        const expectedValue = 'initial value';
        const persistedKey = 'persisted_key';
        const value = new AppsDigestValue(expectedValue, persistedKey);

        value.publish('test');

        expect(setItemSpy).toHaveBeenCalledWith(
          persistedKey,
          JSON.stringify(expectedValue),
        );
      });

      it('should not persist the new value if persist key is not defined', () => {
        const value = new AppsDigestValue<number>(2);

        value.publish(3);

        expect(setItemSpy).not.toHaveBeenCalled();
      });

      it('should not persist the new value if persist key is defined and value has not changed', () => {
        const persistedKey = 'persisted_key';
        const value = new AppsDigestValue(2, persistedKey);
        setItemSpy.mockClear();

        value.publish(2);

        expect(setItemSpy).not.toHaveBeenCalled();
      });

      it('should not persist the new value if persist key is defined and value is undefined', () => {
        const persistedKey = 'persisted_key';
        const value = new AppsDigestValue<number | undefined>(2, persistedKey);
        setItemSpy.mockClear();

        value.publish(undefined);

        expect(setItemSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('subscribe tests', () => {
    it('should create the subscription', () => {
      const value = new AppsDigestValue('');
      const callback = jest.fn();
      value.subscribe(callback);

      const newVal = 'test';
      value.publish(newVal);

      expect(callback).toHaveBeenCalledWith(newVal);
    });

    it('should return the subscription ID', () => {
      const value = new AppsDigestValue(null);

      expect(value.subscribe(() => undefined)).toBe(mockSubId);
    });
  });

  describe('unsubscribe tests', () => {
    it('should return false if subscriber ID is not found', () => {
      const value = new AppsDigestValue('');

      expect(value.unsubscribe('subId')).toBe(false);
    });

    it('should return true if the subscriber ID is found and deleted', () => {
      const value = new AppsDigestValue('');
      const subId = value.subscribe(() => undefined);

      expect(value.unsubscribe(subId)).toBe(true);
    });
  });

  describe('persistency tests', () => {
    it('should hydrate persisted value when persisted value exists', () => {
      const expectedValue = [1, 2, 3];
      const persistedKey = 'persisted_key';
      new AppsDigestValue(expectedValue, persistedKey);

      const value = new AppsDigestValue(null, persistedKey);

      expect(getItemSpy).toHaveBeenCalledWith(persistedKey);
      expect(value.currentValue()).toEqual(expectedValue);
    });

    it('should create new persisted value when persisted value does not exist', () => {
      const expectedValue = false;
      const persistedKey = 'persisted_key';

      const value = new AppsDigestValue(expectedValue, persistedKey);

      expect(setItemSpy).toHaveBeenCalledWith(
        persistedKey,
        JSON.stringify(expectedValue),
      );
      expect(value.currentValue()).toEqual(expectedValue);
    });

    it('should not create new persisted value when persisted key is not defined', () => {
      new AppsDigestValue(false);

      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });
});
