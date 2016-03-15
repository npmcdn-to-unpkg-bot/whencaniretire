import {Router, Request, Response} from "express";
import * as db from "./db";

  // Send list of funds
export async function getAll(req: Request, res: Response, next: Function) {

  res.send(await db.all("select * from funds"));

}

export function getOne(req: Request, res: Response, next: Function): any {
}
