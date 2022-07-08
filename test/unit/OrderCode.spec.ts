import OrderCode from "../../src/domain/entity/OrderCode";

describe("OrderCode", () => {
  test("Should generate a order code", () => {
    const sut = new OrderCode(new Date("2021-03-01T10:00:00"), 1);
    expect(sut.value).toBe("202100000001");
  });
});
