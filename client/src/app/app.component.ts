import {Component} from "angular2/core";
import {Router, RouteConfig, RouteDefinition, ROUTER_DIRECTIVES} from "angular2/router";
import {AppConfig} from "./app.configuration";

@Component({
  selector: "wcir-app",
  templateUrl: "/partials/app",
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig(AppConfig.routes)
export class AppComponent {

  constructor(private _router: Router) {
  }

  public _routes: any = AppConfig.routes;

  isRouteActive(route: string): boolean {
    return this._router.isRouteActive(this._router.generate([route]));
  }

  public title: string = "When can I retire?";

  trackRouteByPath(index: number, route: RouteDefinition): string {
    return route.path;
  }


}
