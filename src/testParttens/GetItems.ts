import ItemsRepository from "./ItemsRepository";

export default class GetItems {
  constructor(readonly itemsRepository: ItemsRepository) {}

  async execute(): Promise<Output[]> {
    const items = await this.itemsRepository.getList();
    const output: Output[] = [];
    for (const item of items) {
      output.push({
        description: item.nome,
        price: Number(item.valor),
      });
    }
    return output;
  }
}

type Output = {
  description: string;
  price: number;
};
