import {Component, Injector, provide, OnInit, Injectable} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
//import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/pluck";
import {ValuesPipe} from "./ValuesPipe";
import {Fund, FundID, FundWrapper} from "./Fund";

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds",
  pipes: [ValuesPipe]
})
export class FundsComponent implements OnInit {

  //public funds: Fund[];
  //private fundsObserver: Observable<Fund[]>
  private editingFund: FundID;
  private newFund: Fund;
  private modelState: any;

  constructor(private fundsService: FundsService){
  }

  public ngOnInit(){
    /*this.fundsService.funds$.subscribe((updatedFunds) => {
      this.funds = updatedFunds
    });
   */
    //this.fundsService.getAll();
    this.getAll();
    this.clearNew();
    this.cancelEditing();
  }

  public update(f:any): void {
    //this.fundsService.updateFund(f);
    this.cancelEditing();
  }

  public getAll(): void {

    this.modelState = {
      funds: {
        data: {}
      }
    };

    this.fundsService.getFalcor(["funds", "data", {from: 0, to: 24}, ["_id", "symbol", "name"]]).pluck("funds", "data").subscribe(response => {
      this.modelState.funds.data = response;
    });

  }

  public create(): void {
    //this.fundsService.create(this.newFund);
    this.clearNew();
  }

  public edit(f:FundWrapper): void {
    this.editingFund = f.key;
  }

  public cancelEditing(): void {
    this.editingFund = undefined;
  }

  public clearNew(): void {
    this.newFund = {
      _id: "",
      name: "",
      symbol: ""
    };
  }

  public remove(f:any): void {
    console.log("in remove");
    console.log(f);
    this.fundsService.model.call(["fundsById", f.value._id, "remove"]).then(x => console.log(x)).catch(e => console.error(e));
    //this.fundsService.deleteFund(f);
  }

  public trackFundById(index: number, fund: FundWrapper): string {

    return fund.key;

  }

  public isEditing(f:FundWrapper): boolean {

    return this.editingFund === f.value._id;

  }
};



