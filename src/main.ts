import mysql from "mysql2/promise";
import Dimension from "./domain/entity/Dimension";
import GetItems from "./application/GetItems";
import Item from "./domain/entity/Item";
import ItemRepositoryMemory from "./infra/repository/memory/ItemRepositoryMemory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import ItemRepositoryDatabase from "./infra/repository/database/ItemRepositoryDatabase";
import MysqlConnectionAdapter from "./infra/database/MysqlConnectionAdapter";

const http = new ExpressAdapter();

/* const itemRepository = new ItemRepositoryMemory();
itemRepository.save(
  new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
);
itemRepository.save(
  new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
);
itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1)); */

http.on("get", "/items", async (params: any, body: any) => {
  const mysqlConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "branas",
  });
  const connection = new MysqlConnectionAdapter(mysqlConnection);
  const itemRepository = new ItemRepositoryDatabase(connection);
  const getItems = new GetItems(itemRepository);
  const output = await getItems.execute();
  return output;
});

http.listen(3000);
