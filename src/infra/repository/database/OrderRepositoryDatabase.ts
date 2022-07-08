import Order from "../../../domain/entity/Order";
import OrderCoupon from "../../../domain/entity/OrderCoupon";
import OrderItem from "../../../domain/entity/OrderItem";
import OrderRepository from "../../../domain/repository/OrderRepository";
import Connection from "../../database/Connection";

export default class OrderRepositoryDatabase implements OrderRepository {
  constructor(readonly connection: Connection) {}

  async save(order: Order): Promise<void> {
    const [orderData] = await this.connection.query(
      `INSERT INTO \`order\`(codigo, cpf, date, frete, sequencia, total, cupom_code, cupom_porcentagem) 
        VALUES(?,?,?,?,?,?,?,?) returning *`,
      [
        order.code.value,
        order.cpf.value,
        order.date,
        order.freight.getTotal(),
        order.sequence,
        order.getTotal(),
        order.coupon?.code ?? null,
        order.coupon?.percentage ?? null,
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
  async get(code: string): Promise<Order> {
    const [orderData] = await this.connection.query(
      "SELECT * FROM `order` where codigo = ?",
      [code]
    );
    const order = new Order(
      orderData.cpf,
      new Date(orderData.date),
      orderData.sequencia
    );
    const orderItemsData = await this.connection.query(
      "SELECT * FROM `order_item` where id_order = ?",
      [orderData.id]
    );
    //alternativa 1 - hydrate
    order.orderItems = orderItemsData.map(
      (orderItemData: any) =>
        new OrderItem(
          orderItemData.id_item,
          Number(orderItemData.preco),
          orderItemData.quantidade
        )
    );
    order.freight.total = Number(orderData.frete);
    if (orderData.cupom_code) {
      order.coupon = new OrderCoupon(
        orderData.cupom_code,
        orderData.cupom_porcentagem
      );
    }
    //alternativa 2
    /*     for (const orderItemData of orderItemsData) {
      const [itemData] = await this.connection.query(
        "SELECT * FROM item where id = ?",
        [orderItemData.id_item]
      );
      const item = new Item(
        Number(itemData.id),
        itemData.nome,
        Number(itemData.valor),
        new Dimension(
          +itemData.largura,
          +itemData.altura,
          +itemData.profundidade
        ),
        +itemData.peso
      );
      order.addItem(item, +orderItemData.quantidade);
    } 
    if (orderData.cupom_code) {
      const [couponData] = await this.connection.query(
        "SELECT * FROM cupom WHERE codigo = ?",
        [orderData.cupom_code]
      );
      const coupon = new Coupon(
        couponData.codigo,
        couponData.porcentagem,
        couponData.data_expiracao
      );
      order.addCoupon(coupon);
    }
    */
    return order;
  }

  async list(): Promise<Order[]> {
    const orders: Order[] = [];
    const ordersData = await this.connection.query(
      "SELECT codigo FROM `order`",
      []
    );
    for (const orderData of ordersData) {
      const order = await this.get(orderData.codigo);
      orders.push(order);
    }
    return orders;
  }

  async clear(): Promise<void> {
    await this.connection.query("DELETE FROM `order_item`", []);
    await this.connection.query("DELETE FROM `order`", []);
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
