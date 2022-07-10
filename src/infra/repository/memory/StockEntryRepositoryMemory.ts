import Order from "../../../domain/entity/Order";
import StockEntry from "../../../domain/entity/StockEntry";
import StockEntryRepository from "../../../domain/repository/StockEntryRepository";

export default class StockEntryRepositoryMemory
  implements StockEntryRepository
{
  stockEntries: StockEntry[] = [];
  async save(stockEntry: StockEntry): Promise<void> {
    this.stockEntries.push(stockEntry);
  }
  async getStockEntries(idItem: number): Promise<StockEntry[]> {
    return this.stockEntries.filter(
      (stockEntry) => stockEntry.idItem === idItem
    );
  }
  async clear(): Promise<void> {
    this.stockEntries = [];
  }
}
