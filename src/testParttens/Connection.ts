export default class Connection {
  constructor(readonly connection: any) {}

  async query(statement: string, params: any[]) {
    const result = await this.connection.query(statement, params);
    return result;
  }
}
