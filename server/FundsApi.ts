import {GenericApi} from "./GenericApi";
import {Database, DatabaseFieldIntf, DatabaseModel, SortDirection} from "./Database";


export class FundsApi extends GenericApi {

  private dbConfig: DatabaseFieldIntf[] = [{
      name: "rowid",
      alias: "id",
      primaryKey: true
    },{
      name: "symbol",
      sort: SortDirection.Ascending,
      mandatory: true
    },{
      name: "name",
      mandatory: true
    }];


  constructor(db: Database){
    super();

    this.model = new DatabaseModel(db, "funds");
    this.dbConfig.forEach(cfg => {
      this.model.addField(cfg)
    });

  }


};
