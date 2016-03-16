declare module Express {

  interface Request {

    database: Database.IDatabase;

  }

}
