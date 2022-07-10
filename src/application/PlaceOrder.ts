import Order from "../domain/entity/Order";
import StockEntry from "../domain/entity/StockEntry";
import OrderPlaced from "../domain/event/OrderPlaced";
import RepositoryFactory from "../domain/factory/RepositoryFactory";
import CouponRepository from "../domain/repository/CouponRepository";
import ItemRepository from "../domain/repository/ItemRepository";
import OrderRepository from "../domain/repository/OrderRepository";
import Queue from "../infra/queue/Queue";

export default class PlaceOrder {
  orderRepository: OrderRepository;
  itemRepository: ItemRepository;
  couponRepository: CouponRepository;

  constructor(
    readonly repositoryFactory: RepositoryFactory,
    readonly queue: Queue
  ) {
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
    if (input.coupon) {
      const coupon = await this.couponRepository.get(input.coupon);
      order.addCoupon(coupon);
    }
    await this.orderRepository.save(order);
    const orderPlaced = new OrderPlaced(order.code.value, order.orderItems);
    await this.queue.publish(orderPlaced);
    /*     for (const orderItem of input.orderItems) {
      await this.stockEntryRepository.save(
        new StockEntry(orderItem.idItem, "out", orderItem.quantity)
      );
    } */
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
