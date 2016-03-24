import {Request, Router, Response, RequestHandler, ErrorRequestHandler,NextFunction} from "express";
import {ApiMethod, GenericApi} from "./GenericApi";


export class FundsApi extends GenericApi {

  constructor(){
    super();

    this._apis = [
      {method: this._router.get, uri: "/", handler: this.getAll},
      {method: this._router.get, uri: "/:id", handler: this.getOne},
      {method: this._router.post, uri: "/", handler: this.createOne},
      {method: this._router.put, uri: "/:id", handler: this.updateOne},
      {method: this._router.delete, uri: "/:id", handler: this.deleteOne}
    ];

    this.setupApis();

  }

  public async getAll(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await req.database.all("select rowid as id,symbol,name from funds"));
  }

  public async getOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await req.database.all("select * from funds where rowid=$id", {
      $id: req.params.id
    }));
  }

  public async createOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await req.database.run("insert into funds(symbol, name) values ($symbol, $name)", {
      $name: req.body.name,
      $symbol: req.body.symbol
    }));
  }

  public async deleteOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await req.database.run("delete from funds where rowid=$id", {
      $id: req.params.id
    }));
  }

  public async updateOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await req.database.run("update funds set symbol=$symbol,name=$name where rowid=$id", {
      $name: req.body.name,
      $symbol: req.body.symbol,
      $id: req.params.id
    }));
  }

};
