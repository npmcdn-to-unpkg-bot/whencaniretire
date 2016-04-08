import {Injectable} from "angular2/core";
import {Http, Headers, RequestOptions} from "angular2/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/pluck";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import * as falcor from "falcor";

interface Fund {
  id: number;
  fund_symbol: string;
  fund_name: string;
};

interface Datastore {
  funds: Fund[]
};

@Injectable()
export class FundsService {

  private _dataStore: Datastore;
  private _fundsObserver: Observer<Fund[]>;
  private _funds$: Observable<Fund[]>;
  private commonOptions: RequestOptions;
  public model;

  constructor(private _http: Http){
    this._funds$ = new Observable(observer => this._fundsObserver = observer).share();
    this._dataStore = {
      funds: []
    };
    this.commonOptions = new RequestOptions({
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });
    this.model = new falcor.Model({
      source: new falcor.HttpDataSource("/api/model")
    }).batch();

  }

  public getFalcor(path: any): Observable<any> {

    console.log(path);
    return Observable
      .fromPromise(this.model.get(path))
      .pluck("json");

  }

  public get funds$(): Observable<Fund[]> {

    return this._funds$;

  }



  public getAll(page: number = 0): void {

    const pageSize = 25;
    let start = pageSize * page;
    let end = pageSize * (page + 1) - 1;


    /*this.model.get(["funds", "length"]).then(jsonEnvelope => {
      console.log(jsonEnvelope.json);
    });
    */
    this._http
      .get("/api/funds")
      .map(res => res.json())
      .subscribe(data => {
        this._dataStore.funds = data;
        this._fundsObserver.next(this._dataStore.funds)
      }, error => {
        console.log("Could not load funds");
      });

  }

  public create(f:Fund): void {
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
  }

};
