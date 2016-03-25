import * as sqlite3 from "sqlite3";
import * as path from "path";

export class Database implements Database.DatabaseIntf {

  protected _db: sqlite3.Database;

  constructor(filename: string){

    this._db = new sqlite3.Database(path.resolve(filename));

  }

  // Takes a SQL statement and optional parameters and executes it
  // Returns a Promise which can be consumed with an async/await method
  // No data is returned.
  run(sql: string, params?: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this._db.run(sql, params, (err) => {

        if(null === err){
          resolve({});
        }
        else {
          reject(err);
        }
      });

    });

  }

  // Takes a SQL query and optional parameters and executes it
  // Returns a Promise which can be consumed with an async/await method
  // Returns all data found.
  public all(sql: string, params?: any): Promise<any> {
    console.log("in all " + sql);

    return new Promise((resolve, reject) => {

      this._db.all(sql, params, (err, data) => {

        if(null === err){
          resolve(data);
        }
        else {
          console.log(err);
          reject(err);
        }

      });

    });
  };


}


export enum SortDirection {
  Ascending,
  Descending,
  None
};

export interface DatabaseFieldIntf {

  name: string;
  alias?: string;
  mandatory?: boolean;
  primaryKey?: boolean;
  sort?: SortDirection;
};

export class DatabaseField implements DatabaseFieldIntf {

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

  public select(includeAlias: boolean = true): string {
    return this.name + (includeAlias ? : (" as " + this.alias) : "");
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

  private fields: DatabaseField[];
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

  private getFieldList(includeAlias: boolean = true): string {
    return this.fields.map(f => f.select()).join(",");
  }

  private getSortList(): string {
    return this.fields.map(f => f.sortClause()).filter(f => (f !== null)).join(",");
  }

  private select(where?: any): string {

    let whereClause = (where.length > 0 ? (" WHERE " + where.map(w => w.field + " = $" + w.field).join(" AND ")) : "");

    return "SELECT " + this.getFieldList() + " FROM " + this.table + whereClause + " ORDER BY " + this.getSortList();

  }

  public insert(values: any): string {

    return "INSERT INTO " + this.table + "(" + this.getFieldList(false) + ") VALUES ("

  }

  public async getAll(where?: any): Promise<any> {
    if(where === undefined) where = {};
    let whereValueList = {};
    for(var prop in where){
      whereValueList["$" + prop] = where[prop];
    }
    return await this.db.all(this.select(where), whereValueList);

  };



};
