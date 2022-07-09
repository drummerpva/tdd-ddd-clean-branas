import Order from "../domain/entity/Order";
import RepositoryFactory from "../domain/factory/RepositoryFactory";
import CouponRepository from "../domain/repository/CouponRepository";
import ItemRepository from "../domain/repository/ItemRepository";
import OrderRepository from "../domain/repository/OrderRepository";

export default class PlaceOrder {
  orderRepository: OrderRepository;
  itemRepository: ItemRepository;
  couponRepository: CouponRepository;

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.orderRepository = this.repositoryFactory.createOrderRepository();
    this.itemRepository = this.repositoryFactory.createItemRepository();
    this.couponRepository = this.repositoryFactory.createCouponRepository();
  }

  async execute(input: Input): Promise<Output> {
    const sequence = (await this.orderRepository.count()) + 1;
    const order = new Order(input.cpf, input.date, sequence);
    for (const orderItem of input.orderItems) {
      const item = await this.itemRepository.get(orderItem.idItem);
      order.addItem(item, orderItem.quantity);
    }
    // order.freight = (freight > 0 && freight <10) ? 10 : freighta
    if (input.coupon) {
      const coupon = await this.couponRepository.get(input.coupon);
      order.addCoupon(coupon);
    }
    await this.orderRepository.save(order);
    const total = order.getTotal();
    const code = order.code.value;
    return {
      code,
      total,
    };
  }
}

type Input = {
  cpf: string;
  orderItems: { idItem: number; quantity: number }[];
  coupon?: string;
  date?: Date;
};

type Output = {
  total: number;
  code: string;
};
