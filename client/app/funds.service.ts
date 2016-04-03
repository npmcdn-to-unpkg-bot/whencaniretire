import {Injectable} from "angular2/core";
import {Http, Headers, RequestOptions} from "angular2/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";
import * as falcor from "falcor";
import {UuidService} from "./UuidService";

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
  private model;

  constructor(private _http: Http, private uuidService: UuidService){
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
    });

  }

  public get funds$(): Observable<Fund[]> {

    return this._funds$;

  }



  public getAll(): void {

    let uuid = this.uuidService.get();
    let uuid2 = this.uuidService.get();
    /*this.model.set(
      falcor.pathValue(["funds", uuid, "symbol"], 5),
      falcor.pathValue(["funds", uuid2, "symbol"], 4)
    ).then((jsonEnvelope) => {
      console.log("post handler");
      console.log(jsonEnvelope);
      console.log(JSON.stringify(jsonEnvelope, null, 4));
    }).catch((x) => {
      console.log("error handler");
      console.error(x);
    });
    */
    this.model.get(["funds", "ANCFX", "symbol"], ["funds", 2, "symbol"]).then(jsonEnvelope => {
      console.log(jsonEnvelope);
    }).catch(arg => {
      console.error(arg);
    });

    /*this.model.call(["funds", "add"], [{
      symbol: "ANCFX",
      name: "American Funds Fundamental Investors® Class"
    }]).then(x => { console.log(x); }).catch(x => { console.error(x) });
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
