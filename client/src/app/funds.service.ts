import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/share";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer"

interface Fund {
  symbol: string,
  name: string
};

interface Datastore {
  funds: Fund[]
};

@Injectable()
export class FundsService {

  private _dataStore: Datastore;
  private _fundsObserver: Observer<Fund[]>;
  private _funds$: Observable<Fund[]>;

  constructor(private _http: Http){
    this._funds$ = new Observable(observer => this._fundsObserver = observer).share();
    this._dataStore = {
      funds: []
    };
  }

  /*public get funds(): any {

    console.log("in funds getter");
  }*/

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

};
