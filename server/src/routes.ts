import {Request, Response} from "express";

exports.index = (req: Request, res: Response, next: Function) => {
    res.render("index");
};

exports.partials = (req: Request, res: Response, next: Function) => {
    res.render("partials/" + req.params.partial);
};
