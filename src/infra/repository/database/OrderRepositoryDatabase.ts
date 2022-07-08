import Order from "../../../domain/entity/Order";
import OrderRepository from "../../../domain/repository/OrderRepository";
import Connection from "../../database/Connection";

export default class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: Connection) {}

  async save(order: Order): Promise<void> {
    const [orderData] = await this.connection.query(
      `INSERT INTO \`order\`(codigo, cpf, date, frete, sequencia, total, cupom) 
        VALUES(?,?,?,?,?,?,?) returning *`,
      [
        order.code.value,
        order.cpf.value,
        order.date,
        order.freight.getTotal(),
        order.sequence,
        order.getTotal(),
        order.coupon?.code ?? null,
      ]
    );
    for (const orderItem of order.orderItems) {
      await this.connection.query(
        `INSERT INTO order_item(id_order, id_item, preco, quantidade)
        VALUES(?, ?, ?, ?)`,
        [orderData.id, orderItem.idItem, orderItem.price, orderItem.quantity]
      );
    }
  }
  async count(): Promise<number> {
    const [row] = await this.connection.query(
      "SELECT count(*) count FROM `order`",
      []
    );
    return Number(row.count);
  }
}

/* create table 'order' (
  id int not null AUTO_INCREMENT primary key,
  cupom varchar(100),
  codigo varchar(20),
  cpf varchar(30),
  date datetime,
  frete decimal(10,2),
  sequencia int,
  total decimal(10,2)
)

create table `order_item` (
  id_order int,
  id_item int,
  preco decimal(10,2),
  quantidade int,
  primary key(id_order, id_item)
) */
