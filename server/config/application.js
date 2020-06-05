var env = process.env.NODE_ENV || "development",
    packageJson = require("../package.json"),
    path = require("path"),
    express = require("express"),
    bodyParser = require('body-parser'),
    Logger = require("../config/logger.js");

// Logger
global.logger = new Logger([
    "config",
    "db",
    "service",
    "routes",
]);

// Total possible log levels: config, db, service, routes

logger.log("config", "Loading Server in "+env+" mode.");

global.Server = {
    app: express(),
    port: process.env.PORT || 3001,
    version: packageJson.version,
    root: path.join(__dirname, ".."),
    path: path,
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

var router = Server.require("routes.js");
Server.app.use('/', router);

// DB
var DB = Server.require("db/db.js");
var DBURL = "";
try {
    var configFile = require("./secret.json");
    DBURL = configFile.dbUrl;
} catch (err) {
    console.log("Local db url not found");
}
Server.db = new DB(process.env.DBURL || DBURL, "db");
Server.db.connect().then((res) => {
    logger.log("db", res);
}).catch((rej) => {
    logger.log("db", "Error: "+rej);
});


// Client
Server.app.use(express.static(__dirname + "/../../client/build")); // for static content
