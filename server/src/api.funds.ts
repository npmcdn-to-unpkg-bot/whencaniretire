import {Router, Request, Response} from "express";

  // Send list of funds
export function get(req: Request, res: Response, next: Function): any {

  res.send("testing 1234");

}


