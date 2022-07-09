import Connection from "../../infra/database/Connection";

export default class GetOrdersQuery {
  constructor(readonly connection: Connection) {}
  async execute() {
    return this.connection.query(
      `SELECT codigo as code, CAST(total as DOUBLE) as total, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT(
            "description",i.nome,"price",oi.preco
          )
        )from order_item oi 
          inner join item i  on oi.id_item = i.id where oi.id_order = o.id
        ) as items from \`order\` o`,
      []
    );
  }
}
