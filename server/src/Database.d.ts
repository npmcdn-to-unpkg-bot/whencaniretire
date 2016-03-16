declare module Database {
  interface IDatabase {

    run(sql: string, params?: any): Promise<any>;
    all(sql: string, params?: any): Promise<any>;

  }
}
