import {Injectable} from "angular2/core";
import {Http, Headers} from "angular2/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer"

interface Fund {
  id: number;
  symbol: string;
  name: string;
};

interface Datastore {
  funds: Fund[]
};

@Injectable()
export class FundsService {

  private _dataStore: Datastore;
  private _fundsObserver: Observer<Fund[]>;
  private _funds$: Observable<Fund[]>;
  private commonHeaders: Headers;

  constructor(private _http: Http){
    this._funds$ = new Observable(observer => this._fundsObserver = observer).share();
    this._dataStore = {
      funds: []
    };
    this.commonHeaders = new Headers({
      "Content-Type": "application/json"
    });
  }

  public get funds$(): Observable<Fund[]> {

    return this._funds$;

  }



  public getAll(): void {

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
    console.log(f);
    console.log(JSON.stringify(f));

    this._http.post("/api/funds", JSON.stringify(f), {
      headers: this.commonHeaders
    })
      .map(res => res.json())
      .subscribe(data => {
        console.log("resp " + data);
        this.getAll();
      }, error => {
        console.log("err " + error);
      });

  }

  public deleteFund(f:Fund): void {

    this._http.delete("/api/funds/" + f.id, {
      headers: this.commonHeaders
    })
      .map(res => res.json())
      .subscribe(data => {
        console.log("resp " + data);
        this.getAll();
      }, error => {
        console.log("err " + error);
      });


  }

};
