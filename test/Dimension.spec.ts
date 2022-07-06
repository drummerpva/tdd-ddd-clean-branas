import Dimension from "../src/Dimension";

describe("Dimension", () => {
  test("Shoul create a dimension", () => {
    const sut = new Dimension(100, 30, 10);
    const volume = sut.getVolume();
    expect(volume).toBe(0.03);
  });
});
