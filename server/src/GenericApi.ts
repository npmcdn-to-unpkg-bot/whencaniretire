import {Request, Response, NextFunction, Router, IRouterMatcher, RequestHandler, ErrorRequestHandler} from "express";
import {Database} from "./Database"

export enum ApiMethod {
  GET,
  POST,
  DELETE,
  PUT
}

module Apis {

  export interface IApi {
    method: IRouterMatcher<Router>;
    uri: string;
    handler: RequestHandler;
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
      api.method.apply(this._router, [api.uri, this.wrapError(api.handler.bind(this))]);
    });
  }


  public get router(): Router {
    return this._router;
  }

  public set router(r: Router){

    this._router = r;
  }

  protected wrapError = (fn: RequestHandler) => ErrorRequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    };
  }

};


