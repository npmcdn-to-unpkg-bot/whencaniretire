import {Request, Response} from "express";

export function index(req: Request, res: Response, next: Function){
  /*res.render("index", (err, html) => {
    if(err){
      console.log("in hander");
      if(-1 !== err.message.indexOf("Failed to lookup view")){
        return res.status(404).send("Not Found");
      }
      throw err;
    }
    res.send(html);
  });*/
 res.render("index");
};

export function partials(req: Request, res: Response, next: Function){
  res.render("partials/" + req.params.partial);
};
