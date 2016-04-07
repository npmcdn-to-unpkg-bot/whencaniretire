import {Request, Response, Router} from "express";
import {GenericApi} from "./GenericApi";
import {Database, SortDirection} from "./Database";
let falcor = require("falcor");
let falcorExpress = require("falcor-express");
let FalcorRouter = require("falcor-router");
let PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));
import * as path from "path";
let $json = require("json-stringify-safe");

class FundsRouter {

  // A falcor router, not an Express router
  public router: any;
  private db: typeof PouchDB;

  constructor(){

    this.db = new PouchDB(path.join(__dirname, "..", "db", "funds"));

    this.router = FalcorRouter.createClass([{
      route: ["funds", "length"],
      get: this.getFundsLength.bind(this)
    },{
      route: ["funds", FalcorRouter.integers],
      get: this.get.bind(this)
    },{
      route: ["fundsById", FalcorRouter.keys, ["name","symbol"]],
      set: jsonGraphArg => this.set(jsonGraphArg)
    },{
      route: ["fundsById", FalcorRouter.keys, ["name","symbol"]],
      get: this.getById.bind(this)
    },{
      route: ["fundsById", "add"],
      call: (callPath, args) => this.add(callPath, args)
    },{
      route: ["fundsById", "remove"],
      call: (callPath, args) => this.remove(callPath, args)
    }]);

  }

  private getFundsLength(pathSet: any): any {

    return this.db.find({
      selector: {
        _id: {
          $gt: null
        }
      }
    }).then(data => {
      console.log("in pathset promise");
      console.log(pathSet);
      console.log(data.docs);
      return [{
        path: pathSet,
        value: data.docs.length
      }];
    }).catch(err => {
      return [{
        path: pathSet,
        value: falcor.Model.error(err)
      }];
    });

  }

  private set(jsonGraphArg: any): any {


    let ids = Object.keys(jsonGraphArg.funds);

    let data = Promise.all(ids.map(id => {

      return {
        path: ["funds", id, "symbol"],
        value: jsonGraphArg.funds[id].symbol
      };
    }));

    return data;

  }

  private get(pathSet: any): any {

    let min = Math.min.apply(null, pathSet[1]);
    let max = Math.max.apply(null, pathSet[1]);
    let skip = min;
    let limit = 1 + max - min;

    return this.db.find({
      selector: {
        symbol: {
          $gt: null
        }
      },
      fields: ["_id"],
      sort: ["symbol"],
      limit: limit,
      skip: skip
    }).then(data => {
      let d = [];
      pathSet[1].forEach(index => {
        let docIndex = index - skip;
        if(data.docs.hasOwnProperty(docIndex)){
          //Path hit a search result
          d.push({
            path: [pathSet[0], index],
            value: falcor.Model.ref(["fundsById", data.docs[docIndex]._id])
          });
        }
        // We ignore errors here, simply don't return references to the client
      });
      return d;
    }).catch(err => {
      console.log(err);
      return [];
    });
  }

  private getById(pathSet: any): any {

    //easy way of cloning an array
    let fields = pathSet[2].slice(0);
    if(fields.indexOf("_id") === -1) fields.push("_id");

    return Promise.all(pathSet[1].map(id => {
      return this.db.find({
        fields: fields,
        selector: {
          _id: id
        }
      }).then(results => {

        let d = [];
        pathSet[2].forEach(f => {
          results.docs.forEach(doc => {
            d.push({
              path: [pathSet[0], doc._id, f],
              value: doc[f]
            });
          });
        });
        return d;


      });
    })).then(results => {

      return [].concat.apply([], results);

    });


  }

  private add(callPath: any, args: Array<any>): any {

    let newObj = args[0];

    return this.db.post({
      symbol: newObj.symbol,
      name: newObj.name
    }).then(response => {

      return {
        path: ["funds", response.id],
        invalidated: true
      };

    }).catch(response => {

      return {
        path: callPath,
        value: falcor.error(JSON.stringify(response, null, 2))
      };
    });

  }

  private remove(callPath: any, args: any): any {

    return null;

  }


  /*
  private get = (pathSet: any): Promise<any> => {

    console.log(pathSet);
    return new Promise((resolve, reject) => {
      let results = [];

      results.push({
        path: ["funds", "1", "symbol"],
        value: "ANEFX"
      });

      resolve(results);

    });

  };

  private set = (jsonGraphArg: any): Promise<any> => {

    console.log("in bottom set");
    console.log(jsonGraphArg);
    let fundKeys = Object.keys(jsonGraphArg.fundIds);

    return new Promise((resolve, reject) => {

      console.log(jsonGraphArg);
      console.log(null);

    });


  };*/

}

export class ApiManager {

  private fundsApi: GenericApi;
  private accountsApi: GenericApi;
  private _database: Database;
  public router: Router;
  //private model: any;
  private falcorRouter: FundsRouter;

  constructor(){

    this.router = Router();

    //Path is relative to project root
    this._database = new Database("./wcir.db");
    //this._fundsApi = new FundsApi(this._database);

    this.setupFundsApi();
    this.setupAccountsApi();
    this.setupFalcor();

    this.router.use(this.errorHandler);

  }

  private setupFalcor(): void {

    //this.model = new falcor.Model({});
    this.falcorRouter = new FundsRouter();

    this.router.use("/model", falcorExpress.dataSourceRoute((req, res) => {
      return new this.falcorRouter.router();
    }));

  }


  private setupFundsApi(): void {

    this.fundsApi = new GenericApi(this._database, "funds", [{
        name: "rowid",
        alias: "id",
        primaryKey: true
      },{
        name: "fund_symbol",
        sort: SortDirection.Ascending,
        mandatory: true
      },{
        name: "fund_name",
        mandatory: true
      }
    ]);

    this.router.use("/funds", this.fundsApi.router);
  }

  private setupAccountsApi(): void {

    this.accountsApi = new GenericApi(this._database, "accounts", [{
        name: "rowid",
        alias: "id",
        primaryKey: true
      },{
        name: "account_name",
        mandatory: true
      }
    ]);

    this.router.use("/accounts", this.accountsApi.router);

  }

  private errorHandler = (err: any, req: Request, res: Response, next: Function) => {

    res.status(500).send(err);

  };
};



