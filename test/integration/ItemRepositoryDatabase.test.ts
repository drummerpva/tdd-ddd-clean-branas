import mariadb from "mariadb";

import ItemRepositoryDatabase from "../../src/infra/repository/database/ItemRepositoryDatabase";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";

describe("ItemRepositoryDatabase", () => {
  let mysqlConnection: any;
  beforeAll(async () => {
    mysqlConnection = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    });
  });
  test("Shoul return items from database", async () => {
    const connection = new MysqlConnectionAdapter(mysqlConnection);
    const itemRepository = new ItemRepositoryDatabase(connection);
    const items = await itemRepository.list();
    expect(items).toHaveLength(3);
    await connection.close();
  });
});
