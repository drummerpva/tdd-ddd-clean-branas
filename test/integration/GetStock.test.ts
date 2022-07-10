import mariadb from "mariadb";
import GetStock from "../../src/application/GetStock";
import StockEntry from "../../src/domain/entity/StockEntry";
import RepositoryFactory from "../../src/domain/factory/RepositoryFactory";
import StockEntryRepository from "../../src/domain/repository/StockEntryRepository";
import Connection from "../../src/infra/database/Connection";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";

describe("GetStock", () => {
  let mysqlConnection;
  let connection: Connection;
  let stockEntryRepository: StockEntryRepository;
  let repositoryFactory: RepositoryFactory;
  beforeEach(async () => {
    mysqlConnection = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    });
    connection = new MysqlConnectionAdapter(mysqlConnection);
    repositoryFactory = new DatabaseRepositoryFactory(connection);
    stockEntryRepository = repositoryFactory.createStockEntryRepository();
    await stockEntryRepository.clear();
  });
  afterEach(async () => {
    await connection.close();
  });
  test("Should return stock of an item", async () => {
    stockEntryRepository.save(new StockEntry(1, "in", 10));
    stockEntryRepository.save(new StockEntry(1, "in", 10));
    stockEntryRepository.save(new StockEntry(1, "out", 5));
    stockEntryRepository.save(new StockEntry(1, "out", 5));
    const sut = new GetStock(repositoryFactory);
    const output = await sut.execute(1);
    expect(output.total).toBe(10);
  });
});
