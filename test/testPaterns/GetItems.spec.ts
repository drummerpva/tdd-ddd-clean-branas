import mariadb from "mariadb";
import sinon from "sinon";
import GetItems from "../../src/testParttens/GetItems";
import Connection from "../../src/testParttens/Connection";
import ItemsRepositoryDatabase from "../../src/testParttens/ItemsRepositoryDatabase";
import ItemsRepositoryMemory from "../../src/testParttens/ItemsRepositoryMemory";

describe("GetItems", () => {
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
  test("Should get items list", async () => {
    const connection = new Connection(mysqlConnection);
    const itemsRepository = new ItemsRepositoryDatabase(connection);
    const getItems = new GetItems(itemsRepository);
    const items = await getItems.execute();
    expect(items).toHaveLength(3);
    expect(items[0].description).toBe("Guitarra");
    expect(items[0].price).toBe(1000);
  });

  test("Should get items list with fake repository", async () => {
    const itemsRepository = new ItemsRepositoryMemory();
    const getItems = new GetItems(itemsRepository);
    const items = await getItems.execute();
    expect(items).toHaveLength(3);
    expect(items[0].description).toBe("Bateria");
    expect(items[0].price).toBe(5000);
  });

  test("Should get items list with stub", async () => {
    const connection = new Connection(mysqlConnection);
    const itemsRepository = new ItemsRepositoryDatabase(connection);
    sinon
      .stub(itemsRepository, "getList")
      .returns(Promise.resolve([{ nome: "Bola", valor: 100 }]));
    const getItems = new GetItems(itemsRepository);
    const items = await getItems.execute();
    expect(items).toHaveLength(1);
    expect(items[0].description).toBe("Bola");
    expect(items[0].price).toBe(100);
    sinon.restore();
  });

  test("Should get items list with spy", async () => {
    const connection = new Connection(mysqlConnection);
    const itemsRepository = new ItemsRepositoryDatabase(connection);
    const spy = sinon.spy(itemsRepository, "getList");
    const getItems = new GetItems(itemsRepository);
    const items = await getItems.execute();
    expect(items).toHaveLength(3);
    sinon.assert.calledOnce(spy);
    sinon.restore();
  });

  test("Should get items list with mock", async () => {
    const connection = new Connection(mysqlConnection);
    const itemsRepository = new ItemsRepositoryDatabase(connection);
    const getItems = new GetItems(itemsRepository);
    const mock = sinon.mock(itemsRepository);
    mock.expects("getList").returns([{ nome: "Keyboard", valor: 2350 }]);
    const items = await getItems.execute();
    expect(items).toHaveLength(1);
    expect(items[0].description).toBe("Keyboard");
    expect(items[0].price).toBe(2350);
    mock.verify();
    sinon.restore();
  });
});
