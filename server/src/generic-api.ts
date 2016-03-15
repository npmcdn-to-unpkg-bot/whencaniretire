import {Router} from "express";

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

