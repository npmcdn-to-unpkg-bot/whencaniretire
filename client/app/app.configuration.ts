import {DashboardComponent} from "./dashboard.component";
import {ActivityComponent} from "./activity.component";
import {FundsComponent} from "./funds.component";

export var AppConfig = {

  routes: [
    {path: "/dashboard", name: "Dashboard", component: DashboardComponent, useAsDefault: true},
    {path: "/funds", name: "Funds", component: FundsComponent},
    {path: "/activity", name: "Activity", component: ActivityComponent}
  ]

};
