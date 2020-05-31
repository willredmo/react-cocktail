var router = require("express").Router();

// Set client route
router.get('/', (req, res) => {
    res.sendFile(Server.path.resolve("../client/build/index.html"));
});

// Set api routes
var apiService = Server.require("service/api.js");
router.route("/api/getAllData").get(apiService.getAllData);
router.route("/api/filterDrinkList").get(apiService.filterDrinkList);
router.route("/api/getDrinkDetails/:drinkId").get(apiService.getDrinkDetails);
router.route("/api/getRandomDrinkDetails").get(apiService.getRandomDrinkDetails);

// Set get data route
var dataService = Server.require("service/collectData.js");
router.route("/collectData").get(dataService.collectData);

module.exports = router;