import {Component, OnInit} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
//import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/pluck";
import {ValuesPipe} from "./ValuesPipe";
import {Fund, FundID, FundWrapper} from "./Fund";
import {FundComponent} from "./FundComponent";

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds",
  pipes: [ValuesPipe],
  directives: [FundComponent]
})
export class FundsComponent implements OnInit {

  private newFund: Fund;

  constructor(private fundsService: FundsService){
  }

  public ngOnInit(){
    this.fundsService.getAll();
    this.clearNew();
    //this.cancelEditing();
  }

  public create(): void {
    //this.fundsService.create(this.newFund);
    this.clearNew();
  }

  public clearNew(): void {
    this.newFund = {
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

};



