import {Component, Injector, provide, OnInit} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
//import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/pluck";
import {ValuesPipe} from "./ValuesPipe";
/*
class Fund {

  public _id: string;
  public symbol: string;
  public name: string;

  constructor(){
    this.fund_name = "";
    this.fund_symbol = "";
  }
};*/

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds",
  pipes: [ValuesPipe]
})
export class FundsComponent implements OnInit {

  //public funds: Fund[];
  //private fundsObserver: Observable<Fund[]>
  private editingFund: string;
  private newFund: any;
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

  public edit(f:any): void {
    this.editingFund = f.key;
  }

  public cancelEditing(): void {
    this.editingFund = undefined;
  }

  public isEditing(f:any): boolean {
    return f.key === this.editingFund;
  }

  public clearNew(): void {
    this.newFund = {};
  }

  public remove(f:any): void {
    console.log("in remove");
    console.log(f);
    this.fundsService.model.call(["fundsById", f.value._id, "remove"]).then(x => console.log(x)).catch(e => console.error(e));
    //this.fundsService.deleteFund(f);
  }

  public trackFundById(index: number, fund: any): string {
    return fund.key;
  }
};



