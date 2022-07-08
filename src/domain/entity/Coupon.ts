export default class Coupon {
  constructor(
    readonly code: string,
    readonly percentage: number,
    readonly expireDate: Date = new Date()
  ) {}

  isExpired(now: Date) {
    return now.getTime() > this.expireDate.getTime();
  }
}
