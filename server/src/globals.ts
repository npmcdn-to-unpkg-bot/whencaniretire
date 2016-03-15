import * as sqlite3 from "sqlite3";
import * as path from "path";

interface GlobalsInterface {
  DATABASE: sqlite3.Database;
}

class GlobalsImpl implements GlobalsInterface {

  public DATABASE: sqlite3.Database;

  constructor(){

    this.DATABASE = new sqlite3.Database(path.resolve("./dist/wcir.db"));

  }

}

var Globals:GlobalsInterface = new GlobalsImpl();

export = Globals;
