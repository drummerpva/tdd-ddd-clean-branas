import mariadb from "mariadb";

import SimulateFreight from "../../src/application/SimulateFreight";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import MysqlConnectionAdapter from "../../src/infra/database/MysqlConnectionAdapter";
import ItemRepositoryDatabase from "../../src/infra/repository/database/ItemRepositoryDatabase";
import ItemRepositoryMemory from "../../src/infra/repository/memory/ItemRepositoryMemory";

describe("SimulateFreight", () => {
  test("Should simulate order freight", async () => {
    /* const mysqlConnection = await mariadb.cretePool({
      host: "localhost",
      user: "root",
      password: "root",
      database: "branas",
    }).getConnection();
    const connection = new MysqlConnectionAdapter(mysqlConnection);
    const itemRepository = new ItemRepositoryDatabase(connection); */
    const itemRepository = new ItemRepositoryMemory();
    itemRepository.save(
      new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3)
    );
    itemRepository.save(
      new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20)
    );
    itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
    const sut = new SimulateFreight(itemRepository);
    const input = {
      orderItems: [
        { idItem: 1, quantity: 1 },
        { idItem: 2, quantity: 1 },
        { idItem: 3, quantity: 3 },
      ],
    };
    const output = await sut.execute(input);
    expect(output.total).toBe(260);
  });
});
