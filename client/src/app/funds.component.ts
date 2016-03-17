import {Component, Injector, provide} from "angular2/core";
import {RouteConfig} from "angular2/router";
import {FundsService} from "./funds.service";
import {Modal, ModalConfig, ModalDialogInstance, YesNoModal, YesNoModalContent, ICustomModal} from "angular2-modal";

interface Fund {
  symbol: string;
  name: string;
};

@Component({
  selector: "wcir-funds",
  templateUrl: "/partials/funds"
})
export class FundsComponent {

  constructor(private _fundsService: FundsService, private _modal: Modal){
    this._funds = _fundsService.funds;
  }

  public _dialog: Promise<ModalDialogInstance>;
  public _funds: Fund[];

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
};



