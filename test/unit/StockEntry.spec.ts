import StockEntry from "../../src/domain/entity/StockEntry";

describe("StockEntry", () => {
  test("Should create an entry at stock", () => {
    const sut = new StockEntry(1, "in", 10);
    expect(sut.idItem).toBe(1);
    expect(sut.operation).toBe("in");
    expect(sut.quantity).toBe(10);
  });
});
