import Coupon from "../../src/domain/entity/Coupon";
import OrderCoupon from "../../src/domain/entity/OrderCoupon";

describe("OrderCoupon", () => {
  test("Should create a coupon", () => {
    const coupon = new Coupon("VALE20", 20);
    const sut = new OrderCoupon(coupon.code, coupon.percentage);
    expect(sut.calculateDiscount(1000)).toBe(200);
  });
});
