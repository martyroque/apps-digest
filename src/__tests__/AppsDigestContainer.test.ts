import { AppsDigestContainer } from "../AppsDigestContainer";

const mockDestroy = jest.fn();

class MockStore {
  destroy = mockDestroy;
}

const storeContainer = AppsDigestContainer.getInstance();

describe("AppsDigestContainer tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get store", () => {
    const mockStoreDefinition = {
      name: "mockStoreDefinition",
      Class: MockStore,
    };

    it("should return the store instance", () => {
      const store = storeContainer.get(mockStoreDefinition);

      expect(store).toBeInstanceOf(MockStore);
    });
  });

  describe("remove store", () => {
    const mockRemoveStoreDefinition = {
      name: "mockRemoveStoreDefinition",
      Class: MockStore,
    };

    it("should return false when store record was not found", () => {
      expect(
        storeContainer.remove({
          name: "notFound",
          Class: jest.fn(),
        })
      ).toBe(false);
    });

    it("should return true when store record was found", () => {
      storeContainer.get(mockRemoveStoreDefinition);

      expect(storeContainer.remove(mockRemoveStoreDefinition)).toBe(true);
    });

    it("should call destroy the store instance when store has only 1 reference", () => {
      storeContainer.get(mockRemoveStoreDefinition);

      storeContainer.remove(mockRemoveStoreDefinition);

      expect(mockDestroy).toHaveBeenCalledTimes(1);
    });

    it("should not destroy the store instance when store has more than 1 reference", () => {
      storeContainer.get(mockRemoveStoreDefinition);
      storeContainer.get(mockRemoveStoreDefinition);

      storeContainer.remove(mockRemoveStoreDefinition);

      expect(mockDestroy).not.toHaveBeenCalled();
    });
  });
});
