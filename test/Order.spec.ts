import Counpon from "../src/Coupon";
import Item from "../src/Item";
import Order from "../src/Order";

describe("Order", () => {
  test("Should not create a order with invalid CPF", () => {
    expect(() => new Order("111.111.111-11")).toThrow(
      new Error("CPF Inválido")
    );
  });

  test("Should create an order with 3 items (included description, price and quantity)", () => {
    const sut = new Order("077.135.309-08");
    sut.addItem(new Item(1, "Guitarra", 1000), 1);
    sut.addItem(new Item(2, "Amplificador", 5000), 1);
    sut.addItem(new Item(3, "Cabo", 30), 3);
    const total = sut.getTotal();
    expect(total).toBe(6090);
  });

  test("Should create an order with descount coupon (percent about order total)", () => {
    const sut = new Order("077.135.309-08");
    sut.addItem(new Item(1, "Guitarra", 1000), 1);
    sut.addItem(new Item(2, "Amplificador", 5000), 1);
    sut.addItem(new Item(3, "Cabo", 30), 3);
    sut.addCoupon(new Counpon("VALE20", 20));
    const total = sut.getTotal();
    expect(total).toBe(4872);
  });
});
