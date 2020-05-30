exports.getAllDrinks = async (req, res) => {
    res.json({
        status: 'API Its Working',
        message: 'get all data',
    });
}

exports.filterDrinks = async (req, res) => {
    res.json({
        status: 'API Its Working',
        message: 'filter drinks',
    });
}

exports.getDrinkDetails = async (req, res) => {
    var drinkId = parseInt(req.params.drinkId);
    var drinkDetails = await Server.db.getDrinkDetails(drinkId);
    res.json(drinkDetails);
};

exports.getRandomDrinkDetails = async (req, res) => {
    var drinkDetails = await Server.db.getRandomDrinkDetails();
    res.json(drinkDetails);
};