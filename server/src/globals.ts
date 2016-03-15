import * as path from "path";
import {Database} from "./db";

interface GlobalsInterface {
  DATABASE: Database
}

class GlobalsImpl implements GlobalsInterface {

  public DATABASE: Database;

  constructor(){

    this.DATABASE = new Database(path.resolve("./dist/wcir.db"));

  }

}

var Globals:GlobalsInterface = new GlobalsImpl();

export = Globals;
