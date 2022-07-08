import Coupon from "../../src/domain/entity/Coupon";

describe("Coupon", () => {
  test("Should create a expired coupon", () => {
    const sut = new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00"));
    const isExpired = sut.isExpired(new Date("2021-03-10T10:00:00"));
    expect(isExpired).toBeTruthy();
  });
});
