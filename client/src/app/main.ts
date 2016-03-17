import {provide} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {ROUTER_PROVIDERS} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";
import {AppComponent} from "./app.component";
import {FundsService} from "./funds.service"
import {ModalConfig} from "angular2-modal";

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  provide(ModalConfig, {useValue: new ModalConfig("lg", true, 81)}),
  FundsService
]);
