import {Component, Injector, provide, OnInit} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
//import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";
import {Observable} from "rxjs/Observable";

class Fund {

  public id: number;
  public fund_symbol: string;
  public fund_name: string;

  constructor(){
    this.fund_name = "";
    this.fund_symbol = "";
  }
};

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds"
})
export class FundsComponent implements OnInit {

  public funds: Fund[];
  private fundsObserver: Observable<Fund[]>
  private editingFund: number;
  private newFund: Fund;

  constructor(private fundsService: FundsService){
  }

  public ngOnInit(){
    this.fundsService.funds$.subscribe(updatedFunds => this.funds = updatedFunds);
    this.fundsService.getAll();
    this.clearNew();
    this.cancelEditing();

  }

  public update(f:Fund): void {
    this.fundsService.updateFund(f);
    this.cancelEditing();
  }

  public create(): void {
    this.fundsService.create(this.newFund);
    this.clearNew();
  }

  public edit(f:Fund): void {
    this.editingFund = f.id;
  }

  public cancelEditing(): void {
    this.editingFund = -1;
  }

  public isEditing(f:Fund): boolean {
    return f.id == this.editingFund;
  }

  public clearNew(): void {
    this.newFund = new Fund();
  }

  public deleteFund(f:Fund): void {
    this.fundsService.deleteFund(f);
  }

  public trackFundById(index: number, fund: Fund): number {
    return fund.id;
  }
};



