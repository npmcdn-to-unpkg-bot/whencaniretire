import {Component, Injector, provide, OnInit} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";
import {Observable} from "rxjs/Observable";

interface Fund {
  symbol: string;
  name: string;
};

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds"
})
export class FundsComponent implements OnInit {

  public dialog: Promise<ModalDialogInstance>;
  public funds: Fund[];
  private fundsObserver: Observable<Fund[]>
  private editingFund: string;

  constructor(private fundsService: FundsService, private modal: Modal){
    this.editingFund = "";
  }

  public ngOnInit(){
    this.fundsService.funds$.subscribe(updatedFunds => this.funds = updatedFunds);
    this.fundsService.getAll();

  }

  editFund(symbol: string): void {
    console.log(symbol);
    let bindings = Injector.resolve([
      provide(ICustomModal, {useValue: new YesNoModalContent(" bla bla bla", "msg msg msg", true)})
    ]);

    this.modal.open(<any>YesNoModal, bindings);

  }

  deleteFund(symbol: string): void {

  }

  addFund(): void {

  }

  public trackFundBySymbol(index: number, fund: any): string {
    return fund.symbol;
  }
};



