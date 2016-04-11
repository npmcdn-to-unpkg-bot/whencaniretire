import {Component, Input, OnInit} from "angular2/core";

export type FundID = string;
export type FundSymbol = string;
export type FundName = string;

export interface Fund {

  _id: FundID;
  symbol: FundSymbol;
  name: FundName;

};


@Component({
  selector: "[wcir-fund]",
  templateUrl: "/partials/fund"
})
export class FundComponent {

  @Input("wcir-fund")
  public fund: Fund;
  private editing: boolean;

  constructor(){
  }

  public ngOnInit(): void {

    this.editing = false;

  }

};
