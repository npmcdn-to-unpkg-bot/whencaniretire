const DEV: string  = "development";
const PROD: string = "production";

import * as express from "express";
import * as bodyParser from "body-parser";
import morgan = require("morgan");
//import bodyParser = require("body-parser");
//import routes = require("../routes");
import errorHandler = require("errorhandler");
import path = require("path");
let process = require("process");
let routes = require("./routes");

var app = express();
app.set("env", DEV);
app.set("port", 3000);
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "jade");
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/assets", express.static(path.resolve(__dirname, "../assets")));


app.get("/assets/*", (req, res) => {
  res.status(404).send("Not found");
});

app.get("/", routes.index);
app.get("/partials/:partial", routes.partials);

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
