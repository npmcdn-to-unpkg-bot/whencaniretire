import * as sqlite3 from "sqlite3";
import * as path from "path";

export class Database implements Database.DatabaseIntf {

  protected _db: sqlite3.Database;

  constructor(filename: string){

    console.log(path.resolve(filename));
    this._db = new sqlite3.Database(path.resolve(filename));

  }

  // Takes a SQL statement and optional parameters and executes it
  // Returns a Promise which can be consumed with an async/await method
  // No data is returned.
  run(sql: string, params?: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this._db.run(sql, params, (err) => {

        if(null === err){
          resolve({});
        }
        else {
          reject(err);
        }
      });

    });

  }

  // Takes a SQL query and optional parameters and executes it
  // Returns a Promise which can be consumed with an async/await method
  // Returns all data found.
  all(sql: string, params?: any): Promise<any> {
    console.log("in all " + sql);

    return new Promise((resolve, reject) => {

      this._db.all(sql, params, (err, data) => {

        if(null === err){
          resolve(data);
        }
        else {
          console.log(err);
          reject(err);
        }

      });

    });
  };


}


