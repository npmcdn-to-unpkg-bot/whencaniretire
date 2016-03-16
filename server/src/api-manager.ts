import {Application, Router} from "express";
import {FundsApi} from "./api.funds"
import {GenericApi} from "./generic-api"

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
