import {Router, Request, Response} from "express";
import * as db from "./db";

  // Send list of funds
export async function getAll(req: Request, res: Response, next: Function){
  res.send(await db.all("select * from funds"));
}

export async function getOne(req: Request, res: Response, next: Function){
  res.send(await db.all("select * from funds where symbol=(?)", [req.params.symbol]));
}

export async function createOne(req: Request, res: Response, next: Function){
  res.send(await db.run("insert into funds(symbol, name) values ((?), (?))", [req.body.symbol, req.body.name]));
}

export async function deleteOne(req: Request, res: Response, next: Function){
  res.send(await db.run("delete from funds where symbol=(?)", [req.params.symbol]));
}

export async function updateOne(req: Request, res: Response, next: Function){
  res.send(await db.run("update funds set name=(?) where symbol=(?)", [req.body.name, req.params.symbol]));
}
