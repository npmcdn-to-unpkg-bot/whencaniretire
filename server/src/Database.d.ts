declare module Database {
  interface DatabaseIntf {

    run(sql: string, params?: any): Promise<any>;
    all(sql: string, params?: any): Promise<any>;

  }
}
