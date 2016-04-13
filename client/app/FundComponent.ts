import {Component, OnInit, Input} from "angular2/core";
import {FundsService} from "./funds.service";
import {Fund, FundID, FundWrapper} from "./Fund";

@Component({
  selector: "[wcir-fund]",
  templateUrl: "/partials/fund"
})
export class FundComponent implements OnInit {

  @Input("wcir-fund")
  private fund: FundWrapper

  constructor(private fundsService: FundsService){
  }

  public ngOnInit(){
  }

  public create(): void {
    //this.clearNew();
  }

  public edit(): void {
    this.fundsService.edit(this.fund);
  }

  public remove(f:any): void {
    //this.fundsService.model.call(["fundsById", f.value._id, "remove"]).then(x => console.log(x)).catch(e => console.error(e));
  }

  public isEditing(): boolean {

    return this.fundsService.editingFund === this.fund.value._id;

  }
};




