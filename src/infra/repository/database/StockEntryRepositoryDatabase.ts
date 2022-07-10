import StockEntry from "../../../domain/entity/StockEntry";
import StockEntryRepository from "../../../domain/repository/StockEntryRepository";
import Connection from "../../database/Connection";

export default class StockEntryRepositoryDatabase
  implements StockEntryRepository
{
  constructor(readonly connection: Connection) {}
  async save(stockEntry: StockEntry): Promise<void> {
    await this.connection.query(
      "INSERT INTO stock(id_item, operacao, quantidade) VALUES(?,?,?)",
      [stockEntry.idItem, stockEntry.operation, stockEntry.quantity]
    );
  }
  async getStockEntries(idItem: number): Promise<StockEntry[]> {
    const stockEntriesData = await this.connection.query(
      "SELECT * FROM stock WHERE id_item = ?",
      [idItem]
    );
    return stockEntriesData.map(
      (stockEntryData: any) =>
        new StockEntry(
          Number(stockEntryData.id_item),
          stockEntryData.operacao,
          Number(stockEntryData.quantidade)
        )
    );
  }
  async clear(): Promise<void> {
    await this.connection.query("DELETE FROM stock", []);
  }
}
