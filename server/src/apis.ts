import {Application, Router} from "express";
import {FundsApi} from "./api.funds"

export abstract class GenericApi {

  protected _router: Router;

  constructor(){
    this.router = Router();
  }

  public get router(): Router {
    return this._router;
  }

  public set router(r: Router){

    this._router = r;
  }
};

export class ApiRouter extends GenericApi {

  private _app: Application;
  private _fundsApi: FundsApi;

  constructor(app: Application){
    super();

    this._app = app;
    this._app.use("/api", this.router);

    this._fundsApi = new FundsApi();

    this.router.use("/funds", this._fundsApi.router);

  }

};
