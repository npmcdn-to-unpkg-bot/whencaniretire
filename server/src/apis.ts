import {Router} from "express";
import {FundsApi} from "./api.funds"

export class ApiRouter implements Router {

  constructor(){
    // Call Router()
    super();

    this.use("/funds", new FundsApi());

  }

};
