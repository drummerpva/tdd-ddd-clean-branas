import Connection from "../../database/Connection";
import Item from "../../../domain/entity/Item";
import ItemRepository from "../../../domain/repository/ItemRepository";
import Dimension from "../../../domain/entity/Dimension";

export default class ItemRepositoryDatabase implements ItemRepository {
  constructor(readonly connection: Connection) {}

  async get(idItem: number): Promise<Item> {
    const [itemData] = await this.connection.query(
      "SELECT * FROM item where id = ?",
      [idItem]
    );
    if (!itemData) throw new Error("Item not foun");
    return new Item(
      itemData.id,
      itemData.nome,
      itemData.valor,
      new Dimension(itemData.largura, itemData.altura, itemData.profundidade),
      itemData.peso
    );
  }
  save(item: Item): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async list(): Promise<Item[]> {
    const itemsData = await this.connection.query("SELECT * FROM item", []);
    const items: Item[] = [];
    for (const itemData of itemsData) {
      items.push(new Item(itemData.id, itemData.nome, Number(itemData.valor)));
    }
    return items;
  }
}
