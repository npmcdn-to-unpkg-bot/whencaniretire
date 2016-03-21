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

  public _dialog: Promise<ModalDialogInstance>;
  public _funds: Fund[];
  private _fundsObserver: Observable<Fund[]>

  constructor(private _fundsService: FundsService, private _modal: Modal){
  }

  public ngOnInit(){
    this._fundsService.funds$.subscribe(updatedFunds => this._funds = updatedFunds);
    this._fundsService.getAll();

  }

  editFund(symbol: string): void {
    console.log(symbol);
    let bindings = Injector.resolve([
      provide(ICustomModal, {useValue: new YesNoModalContent(" bla bla bla", "msg msg msg", true)})
    ]);

    this._modal.open(<any>YesNoModal, bindings);

  }

  deleteFund(symbol: string): void {

  }

  addFund(): void {

  }

  public trackFundBySymbol(index: number, fund: any): string {
    return fund.symbol;
  }
};



