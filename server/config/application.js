var env = process.env.NODE_ENV || "development",
    packageJson = require("../package.json"),
    path = require("path"),
    express = require("express"),
    bodyParser = require('body-parser'),
    logger = require("../config/logger.js");

// Logger
global.logger = new logger([
    "config",
    "db",
    "service",
    "routes",
]);

logger.log("config", "Loading Server in "+env+" mode.");

global.Server = {
    app: express(),
    port: process.env.PORT || 3001,
    version: packageJson.version,
    root: path.join(__dirname, ".."),
    appPath: function(path) {
        return this.root+"/"+path;
    },
    require: function(path) {
        return require(this.appPath(path));
    },
    env: env,
    start: function() {
        if (!this.started) {
            this.started = true;
            this.app.listen(this.port);
            logger.log("config", "Running Server Version "+Server.version+" on port "+Server.port+" in "+Server.env+" mode");
        }
    }
};

Server.app.use(bodyParser.urlencoded({ extended: true }));
Server.app.use(bodyParser.json());

var clientRouter = App.require("routes/client.routes.js");
Server.app.use("/", clientRouter);

var apiRouter = Server.require("routes/api.routes.js");
Server.app.use('/api', apiRouter);

// DB
// var Mongodb = Server.require("db/db.js");
// var db = new Mongodb("mongodb://localhost:27017", "db");
// Server.db = db;
// Server.db.connect().then((res) => {
//     logger.log("db", res);
// }).catch((rej) => {
//     logger.log("db", "Error: "+rej);
// });


// Client
Server.app.use(express.static(__dirname + "/client")); // for static content
