import {Injectable} from "angular2/core";
import {Http} from "angular2/http";

interface Fund {
  symbol: string,
  name: string
};

@Injectable()
export class FundsService {

  constructor(private _http: Http){
  }

  private _funds;

  public get funds(): any{

    this.getAll();
    return this._funds;
  }



  public getAll(): any{

    this._http.get("/api/funds")
      .map(res => res.json())
      .subscribe(funds => this._funds = funds);

  }

};
