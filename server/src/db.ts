import * as sqlite3 from "sqlite3";
import {DATABASE} from "./globals";

export function all(sql: string, params?: any[]): Promise<any> {

  return new Promise((resolve, reject) => {

    DATABASE.all(sql, params, (err, data) => {

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

export function run(sql: string, params?: any[]): Promise<any> {

  return new Promise((resolve, reject) => {

    DATABASE.run(sql, params, (err) => {

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

};
