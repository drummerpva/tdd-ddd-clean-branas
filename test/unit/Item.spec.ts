import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";

describe("Item", () => {
  test("Should create a item with dimension", () => {
    const sut = new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3);
    const volume = sut.getVolume();
    const density = sut.getDensity();
    expect(volume).toBe(0.03);
    expect(density).toBe(100);
  });

  test("Should throw new error on negative weight provided", () => {
    expect(
      () => new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), -3)
    ).toThrow(new Error("Invalid param"));
  });
});
