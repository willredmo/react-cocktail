
exports.getDrinkDetails = async (req, res) => {
    var drinkId = parseInt(req.params.drinkId);
    var drinkDetails = await Server.db.getDrinkDetails(drinkId);
    console.log(drinkDetails);
    if (drinkDetails === undefined) {
        drinkDetails = {
            "message": "No drinks found"
        };
    }
    res.json(drinkDetails);
};

exports.getRandomDrinkDetails = async (req, res) => {
    var drinkDetails = await Server.db.getRandomDrinkDetails();
    res.json(drinkDetails);
};

exports.getAllData = async (req, res) => {
    var data = await Server.db.getAllData();
    res.json(data);
};

exports.filterDrinkList = async (req, res) => {
    var drinkList = await Server.db.filterDrinkList(filters);
    res.json(drinkList);
};