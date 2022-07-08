import mysql from "mariadb";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import ItemRepositoryDatabase from "./infra/repository/database/ItemRepositoryDatabase";
import MysqlConnectionAdapter from "./infra/database/MysqlConnectionAdapter";
import ItemController from "./infra/controller/ItemController";
import OrderController from "./infra/controller/OrderController";
import OrderRepositoryDatabase from "./infra/repository/database/OrderRepositoryDatabase";

const http = new ExpressAdapter();
(async () => {
  const mysqlConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "branas",
  });
  const connection = new MysqlConnectionAdapter(mysqlConnection);
  const itemRepository = new ItemRepositoryDatabase(connection);
  const orderRepository = new OrderRepositoryDatabase(connection);
  new ItemController(http, itemRepository);
  new OrderController(http, orderRepository);

  http.listen(3000);
})();
