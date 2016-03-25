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

    console.log(sql);
    console.log(params);
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

  public select(): string {
    return this.name + " AS " + this.alias;
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

  private fields: any;
  private table: string;
  private db: Database;

  constructor(database: Database, table: string){

    this.db = database;
    this.table = table;
    this.fields = {};

  }

  public addField(f: DatabaseFieldIntf): void {
    let dbf = new DatabaseField(f);
    this.fields[dbf.alias] = dbf;
  }

  private getSelectList(): string {
    return Object.keys(this.fields).map(f => this.fields[f].select()).join(",");
  }

  private getSortList(): string {
    return Object.keys(this.fields).map(f => this.fields[f].sortClause()).filter(f => (f !== null)).join(",");
  }

  public async insert(values: any): Promise<any> {
    let fieldList = [];
    let tokenList = [];
    let valueList = {};

    for(var f in values){
      if(f in this.fields && !this.fields[f].primaryKey){
        fieldList.push(this.fields[f].name);
        tokenList.push("$"+this.fields[f].name);
        valueList["$"+this.fields[f].name] = values[f];
      }
    }

    return await this.db.run("INSERT INTO " + this.table + "(" + fieldList.join(",") + ") VALUES (" + tokenList.join(",") + ")", valueList);
  }

  public async update(values: any, criteria: any): Promise<any> {

    let updateList = [];
    let whereClause = [];
    let valueList = {};

    for(var f in values){
      if(f in this.fields && !this.fields[f].primaryKey){
        updateList.push(this.fields[f].name + " = $" + this.fields[f].name);
        valueList["$"+this.fields[f].name] = values[f];
      }
    }

    for(var f in criteria){
      if(f in this.fields){
        whereClause.push(this.fields[f].name + " = $" + this.fields[f].name);
        valueList["$"+this.fields[f].name] = criteria[f];
      }
    }

    let whereStmt = whereClause.length > 0 ? " WHERE " + whereClause.join(" AND ") : "";

    if(updateList.length > 0){
      return this.db.run("UPDATE " + this.table + " SET " + updateList.join(", ") + whereStmt, valueList)
    }
    else {
      return {};
    }

  }

  public async delete(criteria: any): Promise<any> {

    var clauseList = [];
    var valueList = {};

    for(var f in criteria){
      if(f in this.fields){
        clauseList.push(this.fields[f].name + " = $" + this.fields[f].name);
        valueList["$"+this.fields[f].name] = criteria[f];
      }
    }

    return await this.db.run("DELETE FROM " + this.table + " WHERE " + clauseList.join(" AND "), valueList);

  }


  private getSelectStatement(where?: any): string {

    let whereClause = (where.length > 0 ? (" WHERE " + where.map(w => w.field + " = $" + w.field).join(" AND ")) : "");

    return "SELECT " + this.getSelectList() + " FROM " + this.table + whereClause + " ORDER BY " + this.getSortList();

  }

  public async getAll(where?: any): Promise<any> {
    if(where === undefined) where = {};
    let whereValueList = {};
    for(var prop in where){
      whereValueList["$" + prop] = where[prop];
    }
    return await this.db.all(this.getSelectStatement(where), whereValueList);

  }




};
