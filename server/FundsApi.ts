import {Request, Router, Response, RequestHandler, ErrorRequestHandler,NextFunction} from "express";
import {ApiMethod, GenericApi} from "./GenericApi";
import {Database, DatabaseFieldIntf, DatabaseField, DatabaseModel, SortDirection} from "./Database";


export class FundsApi extends GenericApi {

  private model: DatabaseModel;
  private dbConfig: DatabaseFieldIntf[] = [{
      name: "rowid",
      alias: "id",
      primaryKey: true
    },{
      name: "symbol",
      sort: SortDirection.Ascending,
      mandatory: true
    },{
      name: "name",
      mandatory: true
    }];


  constructor(db: Database){
    super();

    this.model = new DatabaseModel(db, "funds");
    this.dbConfig.forEach(cfg => {
      this.model.addField(cfg)
    });


    this._apis = [
      {method: this._router.get, uri: "/", handler: this.getAll},
      {method: this._router.get, uri: "/:id", handler: this.getOne},
      {method: this._router.post, uri: "/", handler: this.createOne},
      {method: this._router.put, uri: "/:id", handler: this.updateOne},
      {method: this._router.delete, uri: "/:id", handler: this.deleteOne}
    ];

    this.setupApis();

  }

  public async getAll(req: Request, res: Response, next: Function) {
    res.send(await this.model.getAll());
  }

  public async getOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.getAll({
      id: req.params.id
    }));
  }

  public async createOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.insert(req.body));
  }

  public async deleteOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await this.model.delete(req.params));
  }

  public async updateOne(req: Request, res: Response, next: Function): Promise<void> {
    res.send(await req.database.run("UPDATE funds SET symbol=$symbol,name=$name WHERE rowid=$id", {
      $name: req.body.name,
      $symbol: req.body.symbol,
      $id: req.params.id
    }));
  }

};
