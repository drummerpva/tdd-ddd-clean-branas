import ValidateCoupon from "../../src/application/ValidateCoupon";
import Coupon from "../../src/domain/entity/Coupon";
import CouponRepositoryMemory from "../../src/infra/repository/memory/CouponRepositoryMemory";

describe("ValidateCoupon", () => {
  test("Should validate a discount coupon expired", async () => {
    const couponRepository = new CouponRepositoryMemory();
    couponRepository.save(
      new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00"))
    );
    const sut = new ValidateCoupon(couponRepository);
    const input = {
      code: "VALE20",
      date: new Date("2021-03-10T10:00:00"),
    };
    const output = await sut.execute(input);
    expect(output.isExpired).toBeTruthy();
  });

  test("Should validate a discount coupon valid", async () => {
    const couponRepository = new CouponRepositoryMemory();
    couponRepository.save(
      new Coupon("VALE20", 20, new Date("2021-03-11T10:00:00"))
    );
    const sut = new ValidateCoupon(couponRepository);
    const input = {
      code: "VALE20",
      date: new Date("2021-03-10T10:00:00"),
    };
    const output = await sut.execute(input);
    expect(output.isExpired).toBeFalsy();
  });
});
