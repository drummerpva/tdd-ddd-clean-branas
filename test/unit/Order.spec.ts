import Coupon from "../../src/domain/entity/Coupon";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import Order from "../../src/domain/entity/Order";

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

  test("Should create an order with descount coupon", () => {
    const sut = new Order("077.135.309-08");
    sut.addItem(new Item(1, "Guitarra", 1000), 1);
    sut.addItem(new Item(2, "Amplificador", 5000), 1);
    sut.addItem(new Item(3, "Cabo", 30), 3);
    sut.addCoupon(new Coupon("VALE20", 20));
    const total = sut.getTotal();
    expect(total).toBe(4872);
  });

  test("Should create an order with expired descount coupon", () => {
    const sut = new Order("077.135.309-08", new Date("2021-03-10T10:00:00"));
    sut.addItem(new Item(1, "Guitarra", 1000), 1);
    sut.addItem(new Item(2, "Amplificador", 5000), 1);
    sut.addItem(new Item(3, "Cabo", 30), 3);
    sut.addCoupon(new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00")));
    const total = sut.getTotal();
    expect(total).toBe(6090);
  });

  test("Should create an order with 3 items and calculate freight", () => {
    const sut = new Order("077.135.309-08");
    sut.addItem(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3),
      1
    );
    sut.addItem(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20),
      1
    );
    sut.addItem(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1), 3);

    //volume = altura/100 * comprimento/100 * profundidade/100;
    //densidade = peso/volume;
    //frete(exercicio) = volume * 1000 * (densidade/100)
    //item1: 30, item2: 200, item3: 30
    const freight = sut.getFreight();
    const total = sut.getTotal();
    expect(freight).toBe(260);
    expect(total).toBe(6350);
  });
});
