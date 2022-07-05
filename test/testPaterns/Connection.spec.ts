import mysql from "mysql2/promise";
import Connection from "../../src/testParttens/Connection";

describe("Items", () => {
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
  test("Should return data from database", async () => {
    const connection = new Connection(mysqlConnection);
    const items = await connection.query("select * from item", []);
    expect(items).toHaveLength(3);
  });
});
