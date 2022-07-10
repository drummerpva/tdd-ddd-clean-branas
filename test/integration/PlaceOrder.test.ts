import mariadb from "mariadb";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import ItemRepositoryMemory from "../../src/infra/repository/memory/ItemRepositoryMemory";
import OrderRepositoryMemory from "../../src/infra/repository/memory/OrderRepositoryMemory";
import PlaceOrder from "../../src/application/PlaceOrder";
import CouponRepositoryMemory from "../../src/infra/repository/memory/CouponRepositoryMemory";
import Coupon from "../../src/domain/entity/Coupon";
import OrderRepositoryDatabase from "../../src/infra/repository/database/OrderRepositoryDatabase";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";
import Connection from "../../src/infra/database/Connection";
import OrderRepository from "../../src/domain/repository/OrderRepository";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import RepositoryFactory from "../../src/domain/factory/RepositoryFactory";
import GetStock from "../../src/application/GetStock";
import StockEntryRepository from "../../src/domain/repository/StockEntryRepository";
import Queue from "../../src/infra/queue/Queue";
import MemoryQueueAdapter from "../../src/infra/queue/MemoryQueueAdapter";
import OrderPlaced from "../../src/domain/event/OrderPlaced";
import StockEntry from "../../src/domain/entity/StockEntry";
import StockHandler from "../../src/application/handler/StockHandler";
import StockController from "../../src/infra/controller/StockController";
import RabbitMQQueueAdapter from "../../src/infra/queue/RabbiMQQueueAdapter";
import { promisify } from "util";
const delay = promisify(setTimeout);

describe("PlaceOrder", () => {
  let mysqlConnection;
  let connection: Connection;
  let orderRepository: OrderRepository;
  let stockEntryRepository: StockEntryRepository;
  let repositoryFactory: RepositoryFactory;
  let queue: Queue;
  beforeEach(async () => {
    mysqlConnection = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    });
    connection = new MysqlConnectionAdapter(mysqlConnection);
    repositoryFactory = new DatabaseRepositoryFactory(connection);
    orderRepository = repositoryFactory.createOrderRepository();
    await orderRepository.clear();
    stockEntryRepository = repositoryFactory.createStockEntryRepository();
    await stockEntryRepository.clear();
    // queue = new MemoryQueueAdapter();
    queue = new RabbitMQQueueAdapter();
    await queue.connect();
  });
  afterEach(async () => {
    await queue.close();
    await connection.close();
  });
  test("Should make a order", async () => {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    // const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    const sut = new PlaceOrder(repositoryFactory, queue);
    const input = {
      cpf: "077.135.309-08",
      orderItems: [
        { idItem: 1, quantity: 1 },
        { idItem: 2, quantity: 1 },
        { idItem: 3, quantity: 3 },
      ],
    };
    const output = await sut.execute(input);
    expect(output.total).toBe(6350);
  });

  test("Should make a order with discount", async () => {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    // const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    await couponRepository.save(
      new Coupon("VALE20", 20, new Date("2021-03-10T10:00:00"))
    );
    const sut = new PlaceOrder(repositoryFactory, queue);
    const input = {
      cpf: "077.135.309-08",
      orderItems: [
        { idItem: 1, quantity: 1 },
        { idItem: 2, quantity: 1 },
        { idItem: 3, quantity: 3 },
      ],
      coupon: "VALE20",
      date: new Date("2021-03-01T10:00:00"),
    };
    const output = await sut.execute(input);
    expect(output.total).toBe(5132);
  });

  test("Should make a order and generate order code", async () => {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    // const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    const sut = new PlaceOrder(repositoryFactory, queue);
    const input = {
      cpf: "077.135.309-08",
      orderItems: [
        { idItem: 1, quantity: 1 },
        { idItem: 2, quantity: 1 },
        { idItem: 3, quantity: 3 },
      ],
      date: new Date("2021-03-01T10:00:00"),
    };
    const output = await sut.execute(input);
    expect(output.code).toBe("202100000001");
  });
  test("Should make a order and throw at stock", async () => {
    new StockController(queue, repositoryFactory);
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    // const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    const sut = new PlaceOrder(repositoryFactory, queue);
    const input = {
      cpf: "077.135.309-08",
      orderItems: [
        { idItem: 1, quantity: 1 },
        { idItem: 2, quantity: 1 },
        { idItem: 3, quantity: 3 },
      ],
    };
    await sut.execute(input);
    await delay(100);
    const getStock = new GetStock(repositoryFactory);
    const output = await getStock.execute(3);
    expect(output.total).toBe(-3);
  });
});
