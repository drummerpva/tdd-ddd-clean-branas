import mysql from "mariadb";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import MysqlConnectionAdapter from "./infra/database/MysqlConnectionAdapter";
import ItemController from "./infra/controller/ItemController";
import OrderController from "./infra/controller/OrderController";
import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory";
import MemoryQueueAdapter from "./infra/queue/MemoryQueueAdapter";
import StockController from "./infra/controller/StockController";

const http = new ExpressAdapter();
const queue = new MemoryQueueAdapter();
(async () => {
  const mysqlConnection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "branas",
  });
  const connection = new MysqlConnectionAdapter(mysqlConnection);
  const repositoryFactory = new DatabaseRepositoryFactory(connection);
  const itemRepository = repositoryFactory.createItemRepository();
  new ItemController(http, itemRepository);
  new OrderController(http, repositoryFactory);
  new StockController(queue, repositoryFactory);

  http.listen(3000);
})();
