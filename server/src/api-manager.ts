import {Request, Response, Router} from "express";
import {FundsApi} from "./api.funds"
import {ApiMethod, GenericApi} from "./generic-api"
import {Database} from "./db";
/*
declare module Express {
  interface Request {

    database: Database;
  }
}
*/

export class ApiManager extends GenericApi {

  private _fundsApi: FundsApi;
  private _database: Database;

  constructor(){
    super();

    this._database = new Database("./wcir.db");
    this._fundsApi = new FundsApi();

    this.router.use(this.databaseInjector);

    this.router.use("/funds", this._fundsApi.router);

    this.router.use(this.errorHandler);

  };

  private databaseInjector = (req: Request, res: Response, next: Function) => {

    req.database = this._database;

    next();
  };

  private errorHandler = (err: any, req: Request, res: Response, next: Function) => {

    res.status(500).send(err);

  };
};



