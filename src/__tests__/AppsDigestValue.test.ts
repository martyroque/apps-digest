import { nanoid } from "nanoid";
import { AppsDigestValue } from "../AppsDigestValue";

jest.mock("nanoid", () => {
  return {
    ...jest.requireActual("nanoid"),
    nanoid: jest.fn(),
  };
});

const mockSubId = "0833ddfb047128aac74ab3e7fcde25297b2b96b5";
beforeAll(() => {
  (nanoid as jest.Mock).mockReturnValue(mockSubId);
});

describe("AppsDigestValue tests", () => {
  describe("currentValue tests", () => {
    it("should get the current value", () => {
      const initialValue = "test value";
      const value = new AppsDigestValue(initialValue);

      expect(value.currentValue()).toBe(initialValue);
    });
  });

  describe("publish tests", () => {
    it("should return false when publishing the same value", () => {
      const value = new AppsDigestValue(2);

      expect(value.publish(2)).toBe(false);
    });

    it("should return true when publishing a different value", () => {
      const value = new AppsDigestValue("");

      expect(value.publish("test")).toBe(true);
    });
  });

  describe("subscribe tests", () => {
    it("should create the subscription", () => {
      const value = new AppsDigestValue("");
      const callback = jest.fn();
      value.subscribe(callback);

      const newVal = "test";
      value.publish(newVal);

      expect(callback).toHaveBeenCalledWith(newVal);
    });

    it("should return the subscription ID", () => {
      const value = new AppsDigestValue(null);

      expect(value.subscribe(() => undefined)).toBe(mockSubId);
    });
  });

  describe("unsubscribe tests", () => {
    it("should return false if subscriber ID is not found", () => {
      const value = new AppsDigestValue("");

      expect(value.unsubscribe("subId")).toBe(false);
    });

    it("should return true if the subscriber ID is found and deleted", () => {
      const value = new AppsDigestValue("");
      const subId = value.subscribe(() => undefined);

      expect(value.unsubscribe(subId)).toBe(true);
    });
  });
});
