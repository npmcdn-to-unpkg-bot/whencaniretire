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


  public get router(): Router {
    return this._router;
  }

  public set router(r: Router){

    this._router = r;
  }

  protected setupApis(): void {

    this._apis.forEach((api, idx, val) => {

      api.method.apply(this._router, [api.uri, this.wrapError(api.handler.bind(this))]);

    });
  }

  protected wrapError = (fn: RequestHandler):RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      fn(req, res, next).catch(next);
    }
  }

  public async getAll(req: Request, res: Response, next: Function) {
    res.send(await this.model.getAll());
  }

  public async getOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.getAll(req.params));
  }

  public async createOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.insert(req.body));
  }

  public async deleteOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.delete(req.params));
  }

  public async updateOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.update(req.body, req.params));
  }
};


