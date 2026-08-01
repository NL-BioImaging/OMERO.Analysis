import { capacityWarning } from "./storageCapacity";

describe("browser Workspace capacity", () => {
  it("rejects the configured Workspace ceiling", () => {
    expect(capacityWarning(90, 20, { usage: 0, quota: 1000 }, 100))
      .toContain("Workspace limit");
  });

  it("reserves transaction headroom in the browser quota", () => {
    expect(capacityWarning(0, 100, { usage: 900, quota: 1000 }, 1000))
      .toContain("insufficient storage");
  });

  it("allows an unknown quota and a bounded payload", () => {
    expect(capacityWarning(20, 30, { usage: 0, quota: 0 }, 100)).toBeNull();
  });
});
