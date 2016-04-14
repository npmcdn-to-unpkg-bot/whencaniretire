import {RouterManager, RouteImplementation} from "./ApiManager";
let PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));
let $json = require("json-stringify-safe");
let path = require("path");
let falcor = require("falcor");
let FalcorRouter = require("falcor-router");

export abstract class Microservice {

  protected routeData: RouteImplementation[];
  protected routerManager: RouterManager;

  constructor(rm: RouterManager) {

    this.routerManager = rm;

  }


  protected registerRoutes(): void {

    this.routeData.forEach(r => {
      let rt = {
        route: r.route,
      };
      rt[r.method] = r.impl.bind(this);

      this.routerManager.registerRoute(rt);
    });

  }
};

export class FundsMicroservice extends Microservice {

  // A falcor router, not an Express router
  //public router: any;
  private db: typeof PouchDB;

  constructor(rm: RouterManager){

    super(rm);
    console.log("in funds microservice");

    this.db = new PouchDB(path.join(__dirname, "..", "db", "funds"));

    this.routeData = [{
      route: ["funds", "length"],
      method: "get",
      impl: this.getFundsLength
    },{
      route: ["funds", "data", FalcorRouter.integers],
      method: "get",
      impl: this.getFundsData
    },{
      route: ["fundsById", FalcorRouter.keys, ["_id", "name","symbol"]],
      method: "get",
      impl: this.getFundsById
    },{
      route: ["fundsById", FalcorRouter.keys, ["name","symbol"]],
      method: "set",
      impl: this.setFundsById
    },{
      route: ["fundsById", FalcorRouter.keys, "remove"],
      method: "call",
      impl: this.remove
    }];

    this.registerRoutes();

  }


  private getFundsLength(pathSet: any): any {

    return this.db.find({
      selector: {
        _id: {
          $gt: null
        }
      }
    }).then(data => {
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

  private getFundsData(pathSet: any): any {

    let min = Math.min.apply(null, pathSet[2]);
    let max = Math.max.apply(null, pathSet[2]);
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
      pathSet[2].forEach(index => {
        let docIndex = index - skip;
        if(data.docs.hasOwnProperty(docIndex)){
          //Path hit a search result
          d.push({
            path: ["funds", "data"].concat(index),
            value: falcor.Model.ref(["fundsById", data.docs[docIndex]._id])
          });
        }
        // We ignore errors here, simply don't return references to the client
      });
      return d;
    }).catch(err => {
      return [{
        path: ["funds", "data"],
        value: falcor.Model.error(err)
      }];
    });
  }

  private getFundsById(pathSet: any): any {

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

  private setFundsById(jsonGraphArg: any): any {

    console.log("in setFundsById");
    console.log(jsonGraphArg);

    let ids = Object.keys(jsonGraphArg.fundsById);


    return Promise.all(ids.map(id => {

      let overallResults: any[] = [];

      let obj = jsonGraphArg.fundsById[id];

      return this.db.find({
        selector: {
          _id: id
        }
      }).then(results => {
        // runs when the db.find operation completes successfully
        let fields = Object.keys(obj);
        fields.forEach(f => {
          results.docs[0][f] = obj[f];
          overallResults.push({
            path: ["fundsById", id, f],
            value: obj[f]
          });
        });

        return this.db.put(results.docs[0]).then(putResponse => {
          // runs when the db put succeeds
          return overallResults;
        }).catch(err => {
          // runs when the db put fails
          // TODO add error handling
          return [];
        });

      });

    })).then(x => {
      // runs when the Promise.all completes
      // flatten paths array of pathSets into single pathset
      return [].concat.apply([], x);

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

    console.log("in remove");
    console.log(callPath);

    return this.db.find({
      selector: {
        _id: callPath[1][0]
      }
    }).then(doc => {
      console.log(doc);
      doc.docs[0]._deleted = true;
      return this.db.put(doc.docs[0]);
    }).then(result => {

      return [{
        path: ["fundsById", callPath[1][0]],
        invalidated: true
      },{
        path: ["funds"],
        invalidated: true
      }];

    }).catch(err => {
      console.error(err);
      return [];
    });


  }

}

