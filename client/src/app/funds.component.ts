import {Component} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";

interface Fund {
  symbol: string;
  name: string;
};

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds"
})
export class FundsComponent {

  constructor(private _fundsService: FundsService){
    this._funds = _fundsService.getAll();
  }

  public _funds: Fund[];

  editFund(symbol: string): void {
    console.log(symbol);
  }

  deleteFund(symbol: string): void {

  }

  addFund(): void {

  }
};



