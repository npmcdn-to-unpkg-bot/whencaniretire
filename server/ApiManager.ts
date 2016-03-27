import {Request, Response, Router} from "express";
import {FundsApi} from "./FundsApi"
import {GenericApi} from "./GenericApi"
import {Database} from "./Database";

export class ApiManager extends GenericApi {

  private _fundsApi: FundsApi;
  private _database: Database;

  constructor(){
    super();

    //Path is relative to project root
    this._database = new Database("./wcir.db");
    this._fundsApi = new FundsApi(this._database);

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



