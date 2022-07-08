import Freight from "../domain/entity/Freight";
import ItemRepository from "../domain/repository/ItemRepository";

export default class SimulateFreight {
  constructor(readonly itemRepository: ItemRepository) {}
  async execute(intput: Input): Promise<Output> {
    const freight = new Freight();
    for (const orderItem of intput.orderItems) {
      const item = await this.itemRepository.get(orderItem.idItem);
      freight.addItem(item, orderItem.quantity);
    }
    const total = freight.getTotal();
    return { total };
  }
}

type Input = {
  orderItems: { idItem: number; quantity: number }[];
};
type Output = {
  total: number;
};
