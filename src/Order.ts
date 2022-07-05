import Counpon from "./Coupon";
import Cpf from "./Cpf";
import Item from "./Item";
import OrderItem from "./OrderItem";

export default class Order {
  cpf: Cpf;
  orderItems: OrderItem[] = [];
  coupon?: Counpon;

  constructor(cpf: string) {
    this.cpf = new Cpf(cpf);
  }

  addItem(item: Item, quantity: number) {
    const orderItem = new OrderItem(item.idItem, item.price, quantity);
    this.orderItems.push(orderItem);
  }

  addCoupon(coupon: Counpon) {
    this.coupon = coupon;
  }

  getTotal() {
    let total = this.orderItems.reduce((total, orderItem) => {
      return total + orderItem.getTotal();
    }, 0);
    if (this.coupon) total -= (total * this.coupon.percentage) / 100;

    return total;
  }
}
