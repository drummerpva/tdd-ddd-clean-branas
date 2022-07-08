import GetOrder from "../../application/GetOrder";
import GetOrders from "../../application/GetOrders";
import OrderRepository from "../../domain/repository/OrderRepository";
import Http from "../http/Http";

export default class OrderController {
  constructor(readonly http: Http, readonly orderRepository: OrderRepository) {
    http.on("get", "/orders", async (params: any, body: any) => {
      const useCase = new GetOrders(orderRepository);
      const output = await useCase.execute();
      return output;
    });
    http.on("get", "/order/:code", async (params: any, body: any) => {
      const useCase = new GetOrder(orderRepository);
      const output = await useCase.execute(params.code);
      return output;
    });
  }
}
