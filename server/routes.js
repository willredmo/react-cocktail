var router = require("express").Router();

// Set api routes
var apiService = Server.require("service/api.js");
router.get("/api/GetAllData", apiService.getAllData);
router.post("/api/filterDrinkList", apiService.filterDrinkList);
router.get("/api/getDrinkDetails/:drinkId", apiService.getDrinkDetails);
router.get("/api/getRandomDrinkDetails", apiService.getRandomDrinkDetails);

// Set get data route
var dataService = Server.require("service/collectData.js");
router.get("/api/collectData", dataService.collectData);

// Set client route
router.get(['/','/:cocktailId'], (req, res) => {
    res.sendFile(Server.path.resolve("../client/build/index.html"));
});

module.exports = router;