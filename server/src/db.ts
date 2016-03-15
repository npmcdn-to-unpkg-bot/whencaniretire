import * as sqlite3 from "sqlite3";

export class Database {

  private _db: sqlite3.Database;

  constructor(filename: string){

    this._db = new sqlite3.Database(filename);

  }

  // Takes a SQL statement and optional parameters and executes it
  // Returns a Promise which can be consumed with an async/await method
  // No data is returned.
  run(sql: string, params?: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this._db.run(sql, params, (err) => {

        if(null === err){
          resolve({
            status: "OK",
            error: null,
            data: null
          });
        }
        else {
          resolve({
            status: "Error",
            error: err,
            data: null
          });
        }
      });

    });

  }

  // Takes a SQL query and optional parameters and executes it
  // Returns a Promise which can be consumed with an async/await method
  // Returns all data found.
  all(sql: string, params?: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this._db.all(sql, params, (err, data) => {

        if(null === err){
          resolve({
            status: "OK",
            error: null,
            data: data
          });
        }
        else {
          resolve({
            status: "Error",
            error: err,
            data: null
          });
        }

      });

    });
  };


}
