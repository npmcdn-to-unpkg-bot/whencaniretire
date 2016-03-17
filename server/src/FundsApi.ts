import {Request, Router, Response} from "express";
import {ApiMethod, GenericApi} from "./GenericApi";


export class FundsApi extends GenericApi {

  constructor(){
    super();

    this._apis = [
      {method: ApiMethod.GET, uri: "/", handler: this.getAll},
      {method: ApiMethod.GET, uri: "/:symbol", handler: this.getOne},
      {method: ApiMethod.POST, uri: "/", handler: this.createOne},
      {method: ApiMethod.PUT, uri: "/:symbol", handler: this.updateOne},
      {method: ApiMethod.DELETE, uri: "/:symbol", handler: this.deleteOne}
    ];

    this.setupApis();

  }

  // GET
  public getAll = async (req: Request, res: Response, next: Function) => {
    res.send(await req.database.all("select * from funds"));
  }

  // GET
  public getOne = async (req: Request, res: Response, next: Function) => {
    res.send(await req.database.all("select * from funds where symbol=$symbol", {
      $symbol: req.params.symbol
    }));
    next();
  }

  // POST
  public createOne = async (req: Request, res: Response, next: Function) => {
    res.send(await req.database.run("insert into funds(symbol, name) values ($symbol, $name)", {
      $name: req.body.name,
      $symbol: req.params.symbol
    }));
  }

  // DELETE
  public deleteOne = async (req: Request, res: Response, next: Function) => {
    res.send(await req.database.run("delete from funds where symbol=$symbol", {
      $symbol: req.params.symbol
    }));
  }

  // PUT
  public updateOne = async (req: Request, res: Response, next: Function) => {
    res.send(await req.database.run("update funds set name=$name where symbol=$symbol", {
      $name: req.body.name,
      $symbol: req.params.symbol
    }));
  }

};
