import Connection from "./Connection";
import ItemsRepository from "./ItemsRepository";

export default class ItemsRepositoryDatabase implements ItemsRepository {
  constructor(readonly connection: Connection) {}
  async getList() {
    return await this.connection.query("select * from item", []);
  }
}
