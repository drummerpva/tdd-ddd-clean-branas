export default interface ItemsRepository {
  getList: () => Promise<any>;
}
