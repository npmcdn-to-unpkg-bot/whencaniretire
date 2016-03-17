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

  private _funds = [{symbol: "ANEFX", name: "American Funds The New Economy Fund® Class A"}];

  public get funds(): any{

    console.log("in funds getter");
    this.getAll();
    return this._funds;
  }



  public getAll(): any{

    /*this._http.get("/api/funds")
      .map(res => res.json())
      .subscribe(funds => this._funds = funds);
    */
  }

};
