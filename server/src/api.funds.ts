import {Router, Request, Response} from "express";
import {DATABASE} from "./globals";
import {GenericApi} from "./generic-api";

export class FundsApi extends GenericApi {

  constructor(){
    super();

    this.router.get("/", this.getAll);
    this.router.get("/:symbol", this.getOne);
    this.router.post("/", this.createOne);
    this.router.put("/:symbol", this.updateOne);
    this.router.delete("/:symbol", this.deleteOne);

  }

  // GET
  public getAll = async (req: Request, res: Response, next: Function) => {
    res.send(await DATABASE.all("select * from funds"));
  }

  // GET
  public getOne = async (req: Request, res: Response, next: Function) => {
    res.send(await DATABASE.all("select * from funds where symbol=$symbol", {$symbol: req.params.symbol}));
  }

  // POST
  public createOne = async (req: Request, res: Response, next: Function) => {
    res.send(await DATABASE.run("insert into funds(symbol, name) values ($symbol, $name)", {$name: req.body.name, $symbol: req.params.symbol}));
  }

  // DELETE
  public deleteOne = async (req: Request, res: Response, next: Function) => {
    res.send(await DATABASE.run("delete from funds where symbol=(?)", {$symbol: req.params.symbol}));
  }

  // PUT
  public updateOne = async (req: Request, res: Response, next: Function) => {
    res.send(await DATABASE.run("update funds set name=$name where symbol=$symbol", {$name: req.body.name, $symbol: req.params.symbol}));
  }

}
