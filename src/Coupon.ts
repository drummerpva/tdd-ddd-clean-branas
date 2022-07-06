export default class Coupon {
  constructor(
    readonly code: string,
    readonly percentage: number,
    readonly expireDate: Date = new Date()
  ) {}

  calculateDiscount(value: number) {
    return (value * this.percentage) / 100;
  }

  isExpired(now: Date) {
    return now.getTime() > this.expireDate.getTime();
  }
}
