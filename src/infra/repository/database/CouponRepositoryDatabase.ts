import Coupon from "../../../domain/entity/Coupon";
import CouponRepository from "../../../domain/repository/CouponRepository";
import Connection from "../../database/Connection";

export default class CouponRepositoryDatabase implements CouponRepository {
  constructor(readonly connection: Connection) {}
  async get(code: string): Promise<Coupon> {
    const [couponData] = await this.connection.query(
      "SELECT * FROM cupom WHERE codigo = ?",
      [code]
    );
    if (!couponData) throw new Error("Coupon not found");
    return new Coupon(
      couponData.codigo,
      couponData.porcentagem,
      couponData.data_expiracao
    );
  }
  save(coupon: Coupon): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
