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


};
