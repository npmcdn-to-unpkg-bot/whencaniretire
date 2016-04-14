import {Request, Response, Router} from "express";
import {GenericApi} from "./GenericApi";
import {Database, SortDirection} from "./Database";
let falcorExpress = require("falcor-express");
let FalcorRouter = require("falcor-router");
import {FundsMicroservice} from "./FundsMicroservice";

export interface RouteImplementation {

  route: any[];
  method: string;
  impl: Function;
}

export class RouterManager {

  public expressRouter: Router;
  private falcorRouter: any;
  private routeSet: any[];
  private routeObjects: any[];

  constructor() {

    // setup express router
    this.expressRouter = Router();

    this.registerMicroservices();

    this.falcorRouter = FalcorRouter.createClass(this.routeSet);

    this.expressRouter.use("/model", falcorExpress.dataSourceRoute((req, res) => {
      return new this.falcorRouter();
    }));

  }

  private registerMicroservices(): void {

    this.routeObjects = [];
    this.routeSet = [];

    this.routeObjects.push(new FundsMicroservice(this));

  }

  public registerRoute(route: any): void {

    console.log("registering route");
    console.log(route);
    this.routeSet.push(route);

  }

}

/*
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


*/
