import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import ItemRepositoryMemory from "../../src/infra/repository/memory/ItemRepositoryMemory";
import OrderRepositoryMemory from "../../src/infra/repository/memory/OrderRepositoryMemory";
import PlaceOrder from "../../src/application/PlaceOrder";
import CouponRepositoryMemory from "../../src/infra/repository/memory/CouponRepositoryMemory";
import Coupon from "../../src/domain/entity/Coupon";

describe("PlaceOrder", () => {
  test("Should make a order", async () => {
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    const sut = new PlaceOrder(
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
    const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    await couponRepository.save(new Coupon("VALE20", 20));
    const sut = new PlaceOrder(
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
    const orderRepository = new OrderRepositoryMemory();
    const couponRepository = new CouponRepositoryMemory();
    const sut = new PlaceOrder(
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
      date: new Date("2021-03-01T10:00:00"),
    };
    const output = await sut.execute(input);
    expect(output.code).toBe("202100000001");
  });
});
