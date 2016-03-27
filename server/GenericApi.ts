import {Request, Response, NextFunction, Router, IRouterMatcher, RequestHandler, ErrorRequestHandler} from "express";
import {DatabaseModel} from "./Database";

enum ApiMethod {
  GET,
  POST,
  DELETE,
  PUT
};

interface ApiIntf {
  method: IRouterMatcher<Router>;
  uri: string;
  handler: RequestHandler;
};

export abstract class GenericApi {

  protected model: DatabaseModel;
  private _router: Router;
  private _apis: ApiIntf[];

  constructor(){
    this._router = Router();
    this._apis = [
      {method: this._router.get, uri: "/", handler: this.getAll},
      {method: this._router.get, uri: "/:id", handler: this.getOne},
      {method: this._router.post, uri: "/", handler: this.createOne},
      {method: this._router.put, uri: "/:id", handler: this.updateOne},
      {method: this._router.delete, uri: "/:id", handler: this.deleteOne}
    ];

    this.setupApis();
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


