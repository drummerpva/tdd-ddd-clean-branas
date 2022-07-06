import Dimension from "../src/Dimension";
import Freight from "../src/Freight";
import Item from "../src/Item";

describe("Freight", () => {
  test("Should calculate freight", () => {
    const sut = new Freight();
    sut.addItem(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3),
      1
    );
    sut.addItem(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20),
      1
    );
    sut.addItem(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1), 3);
    const total = sut.getTotal();
    expect(total).toBe(260);
  });
  test("Should calcualte 10.00 as minimium freight", () => {
    const sut = new Freight();
    sut.addItem(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 0.9), 1);
    const total = sut.getTotal();
    expect(total).toBe(10);
  });
});
