import mariadb from "mariadb";
import GetOrders from "../../src/application/GetOrders";
import PlaceOrder from "../../src/application/PlaceOrder";
import Coupon from "../../src/domain/entity/Coupon";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import OrderRepository from "../../src/domain/repository/OrderRepository";
import Connection from "../../src/infra/database/Connection";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";
import OrderRepositoryDatabase from "../../src/infra/repository/database/OrderRepositoryDatabase";
import CouponRepositoryMemory from "../../src/infra/repository/memory/CouponRepositoryMemory";
import ItemRepositoryMemory from "../../src/infra/repository/memory/ItemRepositoryMemory";

describe("GetOrders", () => {
  let mysqlConnection;
  let connection: Connection;
  let orderRepository: OrderRepository;
  beforeEach(async () => {
    mysqlConnection = await mariadb.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    });
    connection = new MysqlConnectionAdapter(mysqlConnection);
    orderRepository = new OrderRepositoryDatabase(connection);
    await orderRepository.clear();
  });
  afterEach(async () => {
    await connection.close();
  });
  test("Should get a empty list order list", async () => {
    const sut = new GetOrders(orderRepository);
    const output = await sut.execute();
    expect(output).toHaveLength(0);
    await connection.close();
  });
  test("Should get order list saved", async () => {
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
    const placeOrder = new PlaceOrder(
      itemRepository,
      orderRepository,
      couponRepository
    );
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
    await placeOrder.execute(input);
    await placeOrder.execute(input);
    const sut = new GetOrders(orderRepository);
    const output = await sut.execute();
    expect(output).toHaveLength(2);
    const [order1, order2] = output;
    expect(order1.code).toBe("202100000001");
    expect(order1.total).toBe(5132);
    expect(order2.code).toBe("202100000002");
    expect(order2.total).toBe(5132);
  });
});
