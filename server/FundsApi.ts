import {Request, Router, Response, RequestHandler, ErrorRequestHandler,NextFunction} from "express";
import {ApiMethod, GenericApi} from "./GenericApi";
import {Database} from "./Database";

enum SortDirection {
  Ascending,
  Descending,
  None
};

interface DatabaseFieldIntf {

  name: string;
  alias?: string;
  mandatory?: boolean;
  primaryKey?: boolean;
  sort?: SortDirection;
};

class DatabaseField implements DatabaseFieldIntf {

  public name: string;
  public alias: string;
  public mandatory: boolean;
  public primaryKey: boolean;
  public sort: SortDirection;

  constructor(options: DatabaseFieldIntf ){
    if(options.name === undefined) throw new Error("Name is required");
    else this.name = options.name;
    if(options.alias !== undefined && options.alias !== "") this.alias = options.alias;
    else this.alias = this.name;
    if(options.mandatory !== undefined) this.mandatory = options.mandatory;
    else this.mandatory = false;
    if(options.primaryKey !== undefined) this.primaryKey = options.primaryKey;
    else this.primaryKey = false;
    if(options.sort !== undefined) this.sort = options.sort;
    else this.sort = SortDirection.None;
  }

  public validate(value: any): boolean {
    if(this.mandatory && !this.primaryKey){
      if(value === undefined || value === null || (typeof value === "string" && value.length === 0)) return false;
    }
    return true;
  }

  public select(): string {
    return this.name + " as " + this.alias;
  }

  public insert(): string {
    return (this.primaryKey ? null : this.name);
  }

  public sortClause(): string {
    switch(this.sort){
      case SortDirection.None:
        return null;
      case SortDirection.Ascending:
        return this.name + " ASC";
      case SortDirection.Descending:
        return this.name + " DESC";
    }
  }
};


export class DatabaseModel {

  public fields: DatabaseField[];
  private table: string;
  private db: Database;

  constructor(database: Database, table: string){

    this.fields = [];
    this.db = database;
    this.table = table;

  }

  public addField(f: DatabaseField): void {
    this.fields.push(f);
  }

  public select(where?: any[]): string {

    let selectList = this.fields.map(f => f.select()).join(",");
    let whereClause = (where.length > 0 ? (" WHERE " + where.map(w => w.field + " = $" + w.field).join(" AND ")) : "");
    let sortList = this.fields.map(f => f.sortClause()).filter(f => (f !== null)).join(",");

    return "SELECT " + selectList + " FROM " + this.table + whereClause + " ORDER BY " + sortList;

  }

  public async getAll(where?: any[]) {
    if(where === undefined) where = [];
    let whereValueList = {};
    where.forEach(v => {
      whereValueList["$" + v.field] = v.value;
    });
    console.log("where values");
    console.log(whereValueList);
    let data = await this.db.all(this.select(where), whereValueList);
    console.log("data is ");
    console.log(data);
    return data;
  };



};

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
      this.model.addField(new DatabaseField(cfg));
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
    res.send(await this.model.getAll([{
      field: "id",
      value: req.params.id
    }]));
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
    res.send(await req.database.run("UPDATE funds SET symbol=$symbol,name=$name WHERE rowid=$id", {
      $name: req.body.name,
      $symbol: req.body.symbol,
      $id: req.params.id
    }));
  }

};
