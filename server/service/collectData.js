var axios = require("axios");

exports.collectData = async (req, res) => {
    // Disable so users cannot reset data
    res.send("Cannot collect data at moment");
    return;

    // Clear old data
    await Server.db.clearData();

    // LOGIC
    // Loop throught alphabet
    // Query drinks per letter
    // Get ingredients from drinks
    // Use drinks collected to insert into db


    var ingredients = [];
    var drinkIds = [];
    var drinkMap = {};

    // Loop throught alphabet
    // Get drinks per letter
    // Get ingredients from drinks

    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
   
    // Alphabet
    for (var alphabetIndex = 0; alphabetIndex < alphabet.length; alphabetIndex++) {
        var letter = alphabet[alphabetIndex];
        var response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/search.php?f="+letter);
        if (response.data.drinks != null) {
            // Drinks
            var responseDrinks = response.data.drinks;
            for (var drinkIndex = 0; drinkIndex < responseDrinks.length; drinkIndex++) {
                var drink = responseDrinks[drinkIndex];
                drink = fixDrink(drink);
                if (!drinkIds.includes(drink.idDrink)) {
                    drinkIds.push(drink.idDrink);
                    drinkMap[drink.idDrink] = drink;
                    console.log("New drink:"+drinkIds.length);
                }

                // Ingredients
                var ingredientIndex = 1;
                var curIngredient = drink["strIngredient"+ingredientIndex];
                while (curIngredient != null) {
                    if (!ingredients.includes(curIngredient) && curIngredient !== "") {
                        ingredients.push(curIngredient);
                    }
                    ingredientIndex++;
                    curIngredient = drink["strIngredient"+ingredientIndex];
                }
            }
        }
    }

    // Loop throught ingredients
    // Query drinks through ingredients
    // Get drink details


    for (var ingredientIndex = 0; ingredientIndex < ingredients.length; ingredientIndex++) {
        var ingredient = ingredients[ingredientIndex];
        
        // if (drinkIds.length >= 1) {
        //     drinkIds = [drinkIds[0]]
        //     break;
        // }

        var response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+ingredient);
        if (response.data.drinks != null) {
            var responseDrinks = response.data.drinks;
            for (var drinkIndex = 0; drinkIndex < responseDrinks.length; drinkIndex++) {
                var drink = responseDrinks[drinkIndex];
                if (!drinkIds.includes(drink.idDrink)) {
                    // Get drink details
                    var drinkResponse = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i="+drink.idDrink);
                    drink = drinkResponse.data.drinks[0];
                    // console.log(drink);
                    drink = fixDrink(drink);
                    drinkIds.push(drink.idDrink);
                    drinkMap[drink.idDrink] = drink;
                    console.log("New drink:"+drinkIds.length);
                }
            }
        }
    }

    console.log("_________________After data collection_______________________");
    console.log("Drinks:"+drinkIds.length);
    console.log("Ingredients:"+ingredients.length);


    // Normalize and insert data into db

    var data = {
        ingredientObjs: [],
        ingredients: [],
        categories: [],
        categoryObjs: [],
        alcoholics: [],
        alcoholicObjs: [],
        glasses: [],
        glassObjs: [],
        drinks: []
    };

    var insertedData = {
        ingredients: {},
        categories: {},
        glasses: {},
        alcoholics: {},
        drinks: {}
    }


    // More common ingredients that are not used in filter
    var nonFilterIngredients = [
        "Ice",
        "Sugar",
        "Water",
        "Tomato juice",
        "Tabasco sauce",
        "Salt",
        "Raisins",
        "Pepper",
        "Orange",
        "Orange peel",
        "Orange juice",
        "Orange spiral",
        "Milk",
        "Lime",
        "Lime juice",
        "Lime peel",
        "Lemon",
        "Lemon juice",
        "Lemon peel",
        "Ice",
        "Honey",
        "Fruit",
        "Cream",
        "Apple",
        "Soda water",
        "Club soda",
        "Vanilla extract"
    ];

    const ignoreDrinks = [
        "15395",
        "16405",
        "15182",
        "17196",
        "11288",
        "14466",
        "15743",
        "14053",
        "11872",
        "13198",
        "17122",
        "13625",
        "178306"
    ];

    for (var i = 0; i < drinkIds.length; i++) {
        if (ignoreDrinks.includes(drinkIds[i])) {
            i++;
            if (i >= drinkIds.length) {
                break;
            }
        }
        var drink = drinkMap[[drinkIds[i]]];
        
        var newDrink = {
            id: parseInt(drink.idDrink),
            name: drink.strDrink,
            instructions: drink.strInstructions,
            thumbnail: drink.strDrinkThumb,
            category: {},
            alcoholic: {},
            glass: {},
            ingredients: []
        };

        if (drink.strCategory === undefined) {
            console.log(drink);
        }

        // Catgeory
        if (!data.categories.includes(drink.strCategory)) {
            data.categories.push(drink.strCategory);
            var newCategory = await Server.db.insertCategory({ name: drink.strCategory });
            insertedData.categories[newCategory.name] = newCategory;
        }
        newDrink.categoryId = insertedData.categories[drink.strCategory]._id;

        if (drink.strAlcoholic == undefined) {
            console.log(drink);
        }

        // Alcoholic
        if (drink.strAlcoholic === "non alcoholic") {
            drink.strAlcoholic = "Non Alcoholic";
        } else if (drink.strAlcoholic === "Optional alcohol") {
            drink.strAlcoholic = "Optional Alcohol";
        }
        if (!data.alcoholics.includes(drink.strAlcoholic)) {
            data.alcoholics.push(drink.strAlcoholic);
            var newAlcoholic = await Server.db.insertAlcoholic({ name: drink.strAlcoholic });
            insertedData.alcoholics[newAlcoholic.name] = newAlcoholic;
        }
        newDrink.alcoholicId = insertedData.alcoholics[drink.strAlcoholic]._id;

        // Glass
        if (!data.glasses.includes(drink.strGlass)) {
            data.glasses.push(drink.strGlass);
            var newGlass = await Server.db.insertGlass({ name: drink.strGlass });
            insertedData.glasses[newGlass.name] = newGlass;
        }
        newDrink.glassId = insertedData.glasses[drink.strGlass]._id;

        // Ingredients
        var ingredientIndex = 1;
        var curIngredient = drink["strIngredient"+ingredientIndex];
        while (curIngredient != null) {
            curIngredient = formatString(curIngredient);
            if (curIngredient == "Whisky") {
                curIngredient = "Whiskey";
            }
            if (!data.ingredients.includes(curIngredient) && curIngredient !== "") {
                data.ingredients.push(curIngredient);
                var newIngredient = await Server.db.insertIngredient({
                    name: curIngredient,
                    thumbnail: "https://www.thecocktaildb.com/images/ingredients/"+encodeURI(curIngredient)+".png",
                    filter: !nonFilterIngredients.includes(curIngredient)
                });
                insertedData.ingredients[newIngredient.name] = newIngredient;
            }
            if (curIngredient !== "") {
                newDrink.ingredients.push({
                    ingredientId: insertedData.ingredients[curIngredient]._id,
                    measure: drink["strMeasure"+ingredientIndex]
                });
            }
            ingredientIndex++;
            curIngredient = drink["strIngredient"+ingredientIndex];
        }
        newDrink = await Server.db.insertDrink(newDrink);
        insertedData.drinks[newDrink.id] = newDrink;
        console.log("Added drink:"+i);
    }

    console.log("done");

    res.json({
        collectedData: data,
        insertedData: insertedData
    });
}  

function fixDrink(drink) {
    if (drink.idDrink === '17174') {
        drink.strAlcoholic = 'Alcoholic';
    }
    if (drink.idDrink == '178320') {
        drink.strGlass = 'Cocktail glass';
    }    
    return drink;
}


function formatString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}