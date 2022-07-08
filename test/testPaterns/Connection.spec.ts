import mariadb from "mariadb";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";

describe("Items", () => {
  let mysqlConnection: any;
  beforeAll(async () => {
    mysqlConnection = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    });
  });
  afterAll(async () => {
    await mysqlConnection.end();
  });
  test("Should return data from database", async () => {
    const connection = new MysqlConnectionAdapter(mysqlConnection);
    const items = await connection.query("select * from item", []);
    expect(items).toHaveLength(3);
  });
});
