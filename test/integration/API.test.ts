import axios from "axios";
describe("API", () => {
  test("Shoul call /items", async () => {
    const response = await axios({
      url: "http://localhost:3000/items",
      method: "get",
    });
    const items = response.data;
    expect(items).toHaveLength(3);
  });
});
