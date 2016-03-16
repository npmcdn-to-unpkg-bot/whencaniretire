import {Request, Router} from "express";
import {Database} from "./db"

export enum ApiMethod {
  get,
  post,
  delete,
  put
}

module Apis {

  export interface IApi {
    method: ApiMethod;
    uri: string;
    handler: Function;
  };
}

export abstract class GenericApi {

  protected _router: Router;
  protected _apis: Apis.IApi[];

  constructor(){
    this._router = Router();
    this._apis = [];
  }

  protected setupApis(){
    this._apis.forEach((api, idx, arr) => {
      this._router[api.method](api.uri, this.wrapError(api.handler));
    });
  }


  public get router(): Router {
    return this._router;
  }

  public set router(r: Router){

    this._router = r;
  }

  protected wrapError = (fn: Function) => {
    return (...args: any[]) => {
      fn(...args).catch(args[2]);
    };
  }

};


