import {Application, Router} from "express";
import * as FundsApi from "./api.funds"

export class ApiRouter {

  private _app: Application;
  private _router: Router;

  constructor(app: Application){
    // Call Router()

    this._router = Router();
    this._app = app;
    this._app.use("/api", this._router);

    this._router.get("/funds", FundsApi.getAll);
    this._router.get("/funds/:symbol", FundsApi.getOne);
    this._router.post("/funds", FundsApi.createOne);
    this._router.put("/funds/:symbol", FundsApi.updateOne);
    this._router.put("/funds/:symbol", FundsApi.deleteOne);

  }

};
