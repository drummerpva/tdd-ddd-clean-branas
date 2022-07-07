import Dimension from "../src/Dimension";
import Item from "../src/Item";
import ItemRepositoryMemory from "../src/ItemRepositoryMemory";
import OrderRepositoryMemory from "../src/OrderRepositoryMemory";
import PlaceOrder from "../src/PlaceOrder";

describe("PlaceOrder", () => {
  test("Should make a order", async () => {
    const itemRepository = new ItemRepositoryMemory();
    const orderRepository = new OrderRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    const sut = new PlaceOrder(itemRepository, orderRepository);
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
});
