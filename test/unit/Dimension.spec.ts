import Dimension from "../../src/domain/entity/Dimension";

describe("Dimension", () => {
  test("Shoul create a dimension", () => {
    const sut = new Dimension(100, 30, 10);
    const volume = sut.getVolume();
    expect(volume).toBe(0.03);
  });
});
