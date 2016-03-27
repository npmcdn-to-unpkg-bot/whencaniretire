import {GenericApi} from "./GenericApi";
import {Database, DatabaseFieldIntf, DatabaseModel, SortDirection} from "./Database";


export class AccountsApi extends GenericApi {


  private dbConfig: DatabaseFieldIntf[] = [{
      name: "rowid",
      alias: "id",
      primaryKey: true
    },{
      name: "account_name",
      sort: SortDirection.Ascending,
      mandatory: true
    }];


  constructor(db: Database){
    super();

    this.model = new DatabaseModel(db, "accounts");
    this.dbConfig.forEach(cfg => {
      this.model.addField(cfg)
    });

  }


};

