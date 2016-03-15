import * as sqlite3 from "sqlite3";
import * as globals from "./app.globals";

export function all(sql: string, params?: any[]): Promise<any> {
  console.log(globals);
  globals.DATABASE.all("select * from funds", (err, data) =>{ console.log(err); console.log(data); });
  return new Promise((resolve, reject) => {

    globals.DATABASE.all(sql, params, (err, data) => {

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
}
