import {Router, Request, Response} from "express";
import * as db from "./db";

abstract class GenericApi {

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
}

export class FundsApi extends GenericApi {

  constructor(){
    super();

    this.router.get("/", this.getAll);
    this.router.get("/:symbol", this.getOne);
    this.router.post("/", this.createOne);
    this.router.put("/:symbol", this.updateOne);
    this.router.delete("/:symbol", this.deleteOne);

  }

  public getAll = async (req: Request, res: Response, next: Function) => {
    res.send(await db.all("select * from funds"));
  }

  public getOne = async (req: Request, res: Response, next: Function) => {
    res.send(await db.all("select * from funds where symbol=(?)", [req.params.symbol]));
  }

  public createOne = async (req: Request, res: Response, next: Function) => {
    res.send(await db.run("insert into funds(symbol, name) values ((?), (?))", [req.body.symbol, req.body.name]));
  }

  public deleteOne = async (req: Request, res: Response, next: Function) => {
    res.send(await db.run("delete from funds where symbol=(?)", [req.params.symbol]));
  }

  public updateOne = async (req: Request, res: Response, next: Function) => {
    res.send(await db.run("update funds set name=(?) where symbol=(?)", [req.body.name, req.params.symbol]));
  }

}
