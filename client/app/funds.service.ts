import {Injectable, OnInit} from "angular2/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/pluck";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import * as falcor from "falcor";
import {Fund, FundID, FundWrapper} from "./Fund"


interface Datastore {
  funds: Fund[]
};

@Injectable()
export class FundsService implements OnInit {

  public dataStore: any;
  //private _fundsObserver: Observer<Fund[]>;
  //private _funds$: Observable<Fund[]>;
  public model;
  public editingFund: FundID;

  constructor(){
    //this._funds$ = new Observable(observer => this._fundsObserver = observer).share();
    this.dataStore = {
      funds: {
        data: { }
      }
    };
    this.model = new falcor.Model({
      source: new falcor.HttpDataSource("/api/model")
    }).batch();

    this.edit();
  }

  public ngOnInit(): void {


  }

  public edit(f:FundWrapper = null): void {
    if(f === undefined || f === null) this.editingFund = null;
    else this.editingFund = f.value._id;
  }

  public isEditing(f:FundWrapper): boolean {
    if(f === undefined || f === null) return false;
    else return this.editingFund === f.value._id;
  }

  public getFalcor(path: any): Observable<any> {

    return Observable
      .fromPromise(this.model.get(path))
      .pluck("json");
  }

  public save(f:FundWrapper): void {

    console.log(" in save");
    console.log(f);

    this.model.set(
      falcor.pathValue(["fundsById", f.value._id, "symbol"], f.value.symbol),
      falcor.pathValue(["fundsById", f.value._id, "name"], f.value.name)
    ).then(response => {
    console.log("response");
      console.log(response);
    }).catch(error => {
    console.log("error");
      console.error(error);
    });

  }

  public getAll(page: number = 0): void {

    const pageSize = 25;
    let start = pageSize * page;
    let end = pageSize * (page + 1) - 1;

    this.getFalcor(["funds", "data", {from : start, to: end}, ["_id", "_rev", "symbol", "name"]]).subscribe(response => {
      console.log(response);
      this.dataStore.funds.data = response.funds.data;
    });

    /*this.model.get(["funds", "length"]).then(jsonEnvelope => {
      console.log(jsonEnvelope.json);
    });
    */
    /*this._http
      .get("/api/funds")
      .map(res => res.json())
      .subscribe(data => {
        this.dataStore.funds = data;
        this._fundsObserver.next(this.dataStore.funds)
      }, error => {
        console.log("Could not load funds");
      });
     */

  }

  /*public create(f:Fund): void {
    this._http.post("/api/funds", JSON.stringify(f), this.commonOptions)
      .map(res => res.json())
      .subscribe(data => {
        this.getAll();
      }, error => {
        console.log("err " + error);
      });
  }

  public deleteFund(f:Fund): void {
    this._http.delete("/api/funds/" + f.id, this.commonOptions)
      .map(res => res.json())
      .subscribe(data => {
        this.getAll();
      }, error => {
      });
  }

  public updateFund(f:Fund): void {
    this._http.put("/api/funds/" + f.id, JSON.stringify(f), this.commonOptions)
      .map(res => res.json())
      .subscribe(data => {
        this.getAll();
      }, error => {
        console.log("err " + error);
      });
  }*/

};
