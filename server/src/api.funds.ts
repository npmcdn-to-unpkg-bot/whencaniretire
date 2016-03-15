import {Router, Request, Response} from "express";

  // Send list of funds
export function getAll(req: Request, res: Response, next: Function): any {

  res.send("testing 1234");

}

export function getOne(req: Request, res: Response, next: Function): any {
}
