import {Router, Request, Response} from "express";

export class FundsApi extends Router {

  constructor(){
    // Call Router()
    super();

    this.get("/", this._get);

  }

  // Send list of funds
  _get(req: Request, res: Response, next: Function) {

    res.send("testing 1234");

  }

};

