
exports.getDrinkDetails = async (req, res) => {
    var drinkId = parseInt(req.params.drinkId);
    var drinkDetails = await Server.db.getDrinkDetails(drinkId);
    if (drinkDetails === undefined) {
        drinkDetails = {
            "message": "No drinks found"
        };
    }
    console.log("Sent drink");
    res.json(drinkDetails);
};

exports.getRandomDrinkDetails = async (req, res) => {
    var drinkDetails = await Server.db.getRandomDrinkDetails();
    console.log("Sent drink");
    res.json(drinkDetails);
};

exports.getAllData = async (req, res) => {
    var data = await Server.db.getAllData();
    console.log("Sent drink");
    res.json(data);
};

exports.filterDrinkList = async (req, res) => {
    var drinkList = await Server.db.filterDrinkList(req.body);
    console.log("Sent filtered drink list");
    res.json(drinkList);
};