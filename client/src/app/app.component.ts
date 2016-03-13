import {Component} from "angular2/core";
import {Router, RouteConfig, ROUTER_DIRECTIVES} from "angular2/router";

import {DashboardComponent} from "./dashboard.component";
import {ActivityComponent} from "./activity.component";

@Component({
  selector: "wcir-app",
  templateUrl: "/partials/app",
  directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
  {path: "/dashboard", name: "Dashboard", component: DashboardComponent, useAsDefault: true},
  {path: "/activity", name: "Activity", component: ActivityComponent}
//  {path: "/funds", name: "Funds", component: FundsComponent},
//  {path: "/reporting", name: "Reporting, component: ReportingComponent}
])
export class AppComponent {

  constructor(private _router: Router) {
  }

  public title: string = "When can I retire?";


}
