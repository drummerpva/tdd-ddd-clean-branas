export default class OrderCoupon {
  constructor(readonly code: string, readonly percentage: number) {}
  calculateDiscount(value: number) {
    return (value * this.percentage) / 100;
  }
}
