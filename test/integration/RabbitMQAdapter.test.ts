import OrderItem from "../../src/domain/entity/OrderItem";
import OrderPlaced from "../../src/domain/event/OrderPlaced";
import RabbitMQQueueAdapter from "../../src/infra/queue/RabbiMQQueueAdapter";

describe.skip("RabbitMQAdapter", () => {
  test("Should publich and consume a message", async () => {
    const sut = new RabbitMQQueueAdapter();
    await sut.connect();
    const orderItems: OrderItem[] = [new OrderItem(1, 1000, 3)];
    await sut.publish(new OrderPlaced("202100000001", orderItems));
    await sut.consume("orderPlaced", (orderPlaced: OrderPlaced) => {
      expect(orderPlaced.code).toBe("202100000001");
    });
    setTimeout(async () => {
      await sut.close();
    }, 500);
  });
});
