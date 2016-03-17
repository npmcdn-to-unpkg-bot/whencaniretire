import {Component} from "angular2/core";
import {Router, RouteConfig, RouteDefinition, ROUTER_DIRECTIVES} from "angular2/router";
import {AppConfig} from "./app.configuration";
import {Modal} from "angular2-modal";

@Component({
  selector: "wcir-app",
  templateUrl: "/partials/app",
  directives: [ROUTER_DIRECTIVES],
  providers: [Modal]
})
@RouteConfig(AppConfig.routes)
export class AppComponent {


  constructor(private _router: Router){
  }

  public _routes: RouteDefinition[] = AppConfig.routes;

  isRouteActive(route: string): boolean {
    return this._router.isRouteActive(this._router.generate([route]));
  }

  public title: string = "When can I retire?";

  public trackRouteByPath(index: number, route: RouteDefinition): string {
    return route.path;
  }



}
