import mysql from "mysql2/promise";

import ItemRepositoryDatabase from "../../src/infra/repository/database/ItemRepositoryDatabase";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";

describe("ItemRepositoryDatabase", () => {
  let mysqlConnection: any;
  beforeAll(async () => {
    mysqlConnection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    });
  });
  afterAll(async () => {
    await mysqlConnection.close();
  });
  test("Shoul return items from database", async () => {
    const connection = new MysqlConnectionAdapter(mysqlConnection);
    const itemRepository = new ItemRepositoryDatabase(connection);
    const items = await itemRepository.list();
    expect(items).toHaveLength(3);
  });
});
