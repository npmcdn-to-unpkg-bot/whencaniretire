import {Request, Response} from "express";

export function index(req: Request, res: Response, next: Function){
  res.render("index");
};

export function partials(req: Request, res: Response, next: Function){
  res.render("partials/" + req.params.partial);
};

export function notfound(req: Request, res: Response, next: Function){
  res.status(404).send("404 Not Found");
};
