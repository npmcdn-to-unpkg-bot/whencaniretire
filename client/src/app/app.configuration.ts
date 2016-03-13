//import {RouteDefinition} from "angular2/router";

import {DashboardComponent} from "./dashboard.component";
import {ActivityComponent} from "./activity.component";

export var AppConfig = {

  routes: [
    {path: "/dashboard", name: "Dashboard", component: DashboardComponent, useAsDefault: true},
    {path: "/activity", name: "Activity", component: ActivityComponent}
  //  {path: "/funds", name: "Funds", component: FundsComponent},
  //  {path: "/reporting", name: "Reporting, component: ReportingComponent}
  ]

};
