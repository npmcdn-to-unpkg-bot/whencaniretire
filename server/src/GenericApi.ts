import {Request, Router, RequestHandler} from "express";
import {Database} from "./Database"

export enum ApiMethod {
  GET,
  POST,
  DELETE,
  PUT
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

  private mapMethod = (m: ApiMethod): Function => {
    switch(m){
      case ApiMethod.GET:
        return this._router.get;
      case ApiMethod.POST:
        return this._router.post;
      case ApiMethod.DELETE:
        return this._router.delete;
      case ApiMethod.PUT:
        return this._router.put;
    }
  }

  protected setupApis(){
    this._apis.forEach((api, idx, arr) => {
      this.mapMethod(api.method)(api.uri, this.wrapError(api.handler));
      //this._router[api.method](api.uri, this.wrapError(api.handler));
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


