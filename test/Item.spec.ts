import Dimension from "../src/Dimension";
import Item from "../src/Item";

describe("Item", () => {
  test("Should create a item with dimension", () => {
    const sut = new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3);
    const volume = sut.getVolume();
    const density = sut.getDensity();
    expect(volume).toBe(0.03);
    expect(density).toBe(100);
  });
});
