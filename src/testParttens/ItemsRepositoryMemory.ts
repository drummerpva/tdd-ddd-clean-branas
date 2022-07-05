import ItemsRepository from "./ItemsRepository";

export default class ItemsRepositoryMemory implements ItemsRepository {
  items: any[];
  constructor() {
    this.items = [
      {
        nome: "Bateria",
        valor: 5000,
      },
      {
        nome: "Bateria",
        valor: 5000,
      },
      {
        nome: "Bateria",
        valor: 5000,
      },
    ];
  }
  async getList() {
    return this.items;
  }
}
