const DEV: string  = "development";
const PROD: string = "production";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as errorHandler from "errorhandler";
import * as path from "path";
//import * as process from "process"; DOESN'T YET WORK, no typings
let process = require("process");
import * as routes from "./routes";
import {ApiRouter} from "./apis";

var app = express();

app.set("env", DEV);
app.set("port", 3000);
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "jade");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/assets", express.static(path.resolve(__dirname, "assets")));



app.get("/api", new ApiRouter());
app.get("/dashboard", routes.index);
app.get("/partials/:partial", routes.partials);
app.get("/assets/*", routes.notfound);
app.get("/favicon.ico", routes.notfound);

if(DEV == app.get("env")){
  app.use(errorHandler);
  app.locals.pretty = true;
}

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});

process.on("SIGINT", () => {
  console.log("Exiting.");
  process.exit(0);
});

