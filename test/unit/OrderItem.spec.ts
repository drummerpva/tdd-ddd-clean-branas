import OrderItem from "../../src/domain/entity/OrderItem";

describe("OrderItem", () => {
  test("Should create an order item", () => {
    const sut = new OrderItem(1, 1000, 2);
    expect(sut.getTotal()).toBe(2000);
  });
  test("Should throw error if negative quantity", () => {
    expect(() => new OrderItem(1, 1000, -2)).toThrow(
      new Error("Invalid quantity")
    );
  });
});
