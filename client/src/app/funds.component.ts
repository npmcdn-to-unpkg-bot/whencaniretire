import {Component, Injector, provide, OnInit} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";
import {Observable} from "rxjs/Observable";

class Fund {

  public id: number;
  public symbol: string;
  public name: string;

  constructor(){
  }
};

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds"
})
export class FundsComponent implements OnInit {

  public dialog: Promise<ModalDialogInstance>;
  public funds: Fund[];
  private fundsObserver: Observable<Fund[]>
  private editingFund: number;
  private newFund: Fund;

  constructor(private fundsService: FundsService, private modal: Modal){
    this.editingFund = -1;
  }

  public ngOnInit(){
    this.fundsService.funds$.subscribe(updatedFunds => this.funds = updatedFunds);
    this.fundsService.getAll();
    this.newFund = new Fund();

  }

  deleteFund(symbol: string): void {

  }

  public add(): void {

  }

  public update(f:Fund): void {

  }

  public create(): void {

    console.log(this.newFund);
    console.log("in create");
    this.fundsService.create(this.newFund);

  }

  public edit(f:Fund): void {
    this.editingFund = f.id;
  }

  public cancelEditing(f:Fund): void {
    this.editingFund = -1;
  }

  public isEditing(f:Fund): boolean {
    return f.id == this.editingFund;
  }

  public clearNew(): void {
    this.newFund.symbol = "";
    this.newFund.name = "";
  }

  public trackFundById(index: number, fund: Fund): number {
    return fund.id;
  }
};



