import amqp from "amqplib";
import DomainEvent from "../../domain/event/DomainEvent";
import Queue from "./Queue";

export default class RabbitMQQueueAdapter implements Queue {
  connection!: amqp.Connection;
  constructor() {}
  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
  }
  async close(): Promise<void> {
    await this.connection.close();
  }
  async consume(eventName: string, callback: any): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(eventName, { durable: true });
    await channel.consume(
      eventName,
      async (msg: any) => {
        await callback(JSON.parse(msg.content.toString()));
      },
      {
        noAck: true,
      }
    );
  }
  async publish(domainEvent: DomainEvent): Promise<void> {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(domainEvent.name, { durable: true });
    channel.sendToQueue(
      domainEvent.name,
      Buffer.from(JSON.stringify(domainEvent))
    );
  }
}
