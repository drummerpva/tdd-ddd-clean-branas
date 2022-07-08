import Connection from "./Connection";

export default class MysqlConnectionAdapter implements Connection {
  constructor(readonly mysqlConnection: any) {}

  async query(statement: string, params: any): Promise<any> {
    const result = await this.mysqlConnection.query(statement, params);
    return result;
  }
  async close(): Promise<void> {
    await this.mysqlConnection.end();
  }
}
