import {Request, Response, Router} from "express";
import {GenericApi} from "./GenericApi";
import {Database, SortDirection} from "./Database";
//import {Model} from "falcor";
let falcor = require("falcor");
let falcorExpress = require("falcor-express");
let FalcorRouter = require("falcor-router");
let PouchDB = require("pouchdb");

class FundsRouter {

  // A falcor router, not an Express router
  public router: any;

  constructor(){

    this.router = FalcorRouter.createClass([{
      route: ["funds", FalcorRouter.keys, "symbol"],
      set: jsonGraphArg => this.set(jsonGraphArg)
    }]);

  }

  private set(jsonGraphArg: any): any {

    console.log("in set");
    console.log(jsonGraphArg);

    let ids = Object.keys(jsonGraphArg.funds);

    let data = ids.map(id => {
      return {
        path: ["funds", id, "symbol"],
        value: jsonGraphArg.funds[id].symbol
      };
    });

    /*let data = [{
      path: ["funds", Object.keys(jsonGraphArg.funds)[0], "symbol"],
      value: Math.floor(Math.random()*5)
    }];*/
    console.log(data);
    return data;

  }
  /*
  private get = (pathSet: any): Promise<any> => {

    console.log(pathSet);
    return new Promise((resolve, reject) => {
      let results = [];

      results.push({
        path: ["funds", "1", "symbol"],
        value: "ANEFX"
      });

      resolve(results);

    });

  };

  private set = (jsonGraphArg: any): Promise<any> => {

    console.log("in bottom set");
    console.log(jsonGraphArg);
    let fundKeys = Object.keys(jsonGraphArg.fundIds);

    return new Promise((resolve, reject) => {

      console.log(jsonGraphArg);
      console.log(null);

    });


  };*/

}

export class ApiManager {

  private fundsApi: GenericApi;
  private accountsApi: GenericApi;
  private _database: Database;
  public router: Router;
  //private model: any;
  private falcorRouter: FundsRouter;

  constructor(){

    this.router = Router();

    //Path is relative to project root
    this._database = new Database("./wcir.db");
    //this._fundsApi = new FundsApi(this._database);

    this.setupFundsApi();
    this.setupAccountsApi();
    this.setupFalcor();

    this.router.use(this.errorHandler);

  }

  private setupFalcor(): void {

    //this.model = new falcor.Model({});
    this.falcorRouter = new FundsRouter();

    this.router.use("/model", falcorExpress.dataSourceRoute((req, res) => {
      return new this.falcorRouter.router();
    }));

  }


  private setupFundsApi(): void {

    this.fundsApi = new GenericApi(this._database, "funds", [{
        name: "rowid",
        alias: "id",
        primaryKey: true
      },{
        name: "fund_symbol",
        sort: SortDirection.Ascending,
        mandatory: true
      },{
        name: "fund_name",
        mandatory: true
      }
    ]);

    this.router.use("/funds", this.fundsApi.router);
  }

  private setupAccountsApi(): void {

    this.accountsApi = new GenericApi(this._database, "accounts", [{
        name: "rowid",
        alias: "id",
        primaryKey: true
      },{
        name: "account_name",
        mandatory: true
      }
    ]);

    this.router.use("/accounts", this.accountsApi.router);

  }

  private errorHandler = (err: any, req: Request, res: Response, next: Function) => {

    res.status(500).send(err);

  };
};



