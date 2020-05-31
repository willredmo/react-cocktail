const MongoClient = require('mongodb').MongoClient;
const Mongoose = require('mongoose'), Schema = Mongoose.Schema;

// Schema
const categorySchema = new Mongoose.Schema({
    name: { type: String, unique: true, required: true, dropDups: true }
}, {collection: 'category'});

const alcoholicSchema = new Mongoose.Schema({
    name: { type: String, unique: true, required: true, dropDups: true }
}, {collection: 'alcoholic'});

const glassSchema = new Mongoose.Schema({
    name: { type: String, unique: true, required: true, dropDups: true }
}, {collection: 'glass'});

const ingredientSchema = new Mongoose.Schema({
    name: { type: String, unique: true, required: true, dropDups: true },
    thumbnail: String,
    filter: Boolean
}, {collection: 'ingredient'});


const drinkSchema = new Mongoose.Schema({
    id: { type: Number, unique: true, required: true, dropDups: true },
    categoryId: { type: Schema.ObjectId, ref: 'category' },
    alcoholicId: { type: Schema.ObjectId, ref: 'alcoholic' },
    glassId: { type: Schema.ObjectId, ref: 'glass' },
    ingredients: [{ 
        ingredientId: { type: Schema.ObjectId, ref: 'ingredient' },
        measure: String
    }],
    name: String,
    instructions: String,
    thumbnail: String
}, {collection: 'drink'});

class DB {
    constructor(url, dbName) {
        this.url = url;
        this.dbName = dbName;
        this.db = null;

        // Models
        this.category = null;
        this.alcoholic = null;
        this.glass = null;
        this.ingredient = null;
        this.drink = null;

        Mongoose.set('useNewUrlParser', true);
        Mongoose.set('useFindAndModify', false);
        Mongoose.set('useCreateIndex', true);
        Mongoose.set('useUnifiedTopology', true);
    }

    connect() {
        logger.log('db', 'Connecting to database ' + this.dbName + ' with URL ' + this.url);
        return new Promise(async (res, rej) => {
            try {
                this.db = await Mongoose.connect(this.url, { dbName: this.dbName, useUnifiedTopology: true, useNewUrlParser: true });
            } catch(err) {
                rej(err);
            };
            

            // Init models
            this.category = Mongoose.model('category', categorySchema);
            this.alcoholic = Mongoose.model('alcoholic', alcoholicSchema);
            this.glass = Mongoose.model('glass', glassSchema);
            this.ingredient = Mongoose.model('ingredient', ingredientSchema);
            this.drink = Mongoose.model('drink', drinkSchema);
            
            res("Connected to database");
        });
    }

    async insertCategories(newCategories) {
        return this.category.insertMany(newCategories);
    }

    async insertCategory(newCategory) {
        return this.category.create(newCategory);
    }

    async getCategories() {
        return this.category.find({});
    }

    async insertAlcoholic(newAlcoholic) {
        return this.alcoholic.create(newAlcoholic);
    }

    async insertGlass(newGlass) {
        return this.glass.create(newGlass);
    }

    async insertIngredient(newIngredient) {
        return this.ingredient.create(newIngredient);
    }

    async insertDrink(newDrink) {
        return this.drink.create(newDrink);
    }

    // Gets drink list and filters
    async getAllData() {
        var drinks = await this.drink.find({}, {id: 1, name: 1, thumbnail: 1, _id: 0}).sort({name: 1});
        var categories = await this.category.find({}, {name: 1, _id: 0}).sort({name: 1});
        var ingredients = await this.ingredient.find({ filter: true }, {name: 1, _id: 0}).sort({name: 1}).limit(50);
        var glasses = await this.glass.find({}, {name: 1, _id: 0}).sort({name: 1});
        var alcoholics = await this.alcoholic.find({}, {name: 1, _id: 0}).sort({name: 1});
        return {
            drinks: drinks,
            totalDrinks: drinks.length,
            filters: {
                categories: categories,
                ingredients: ingredients,
                glasses: glasses,
                alcoholicFilters: alcoholics
            }
        };
    }

    async filterDrinkList(filters) {

    }

    // Gets drinks details of drink id
    async getDrinkDetails(id) {
        var drinkDetails = await this.getDrinkDetailAggregation().match({ id: id });
        return drinkDetails[0];
    }


    // Gets details of drink
    async getRandomDrinkDetails() {
        var drinkDetails = await this.getDrinkDetailAggregation().sample(1);
        return drinkDetails[0];
    }

    // Wraps object in mongoose object type
    wrapObjectId(id) {
        return Mongoose.Types.ObjectId(id);
    }

    // Gets complete drink details
    getDrinkDetailAggregation() {
        return this.drink.aggregate([
            this.getCategoryLookup(),
            this.getGlassLookup(),
            this.getAlcoholicLookup(),
            { $unwind: "$category" },
            { $unwind: "$alcoholic" },
            { $unwind: "$glass" },
            this.getIngredientLookup(),
            this.getAddFieldsAndCombineIngredients(),
            this.hideFields()
        ]);
    }

    // Aggregation for category lookup
    getCategoryLookup() {
        return {
            $lookup: {
                from: "category",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }
        }
    }

    // Aggregation for alcoholic lookup
    getAlcoholicLookup() {
        return {
            $lookup: {
                from: "alcoholic",
                localField: "alcoholicId",
                foreignField: "_id",
                as: "alcoholic"
            }
        }
    }

    // Aggregation form glass lookup
    getGlassLookup() {
        return {
            $lookup: {
                from: "glass",
                localField: "glassId",
                foreignField: "_id",
                as: "glass"
            }
        }
    }

    // Aggregation for ingredient lookup
    getIngredientLookup() {
        return {
            $lookup: {
                from: 'ingredient',
                localField: 'ingredients.ingredientId',
                foreignField: '_id',
                as: 'ingredientData'
            }
        }
    }

    // Adds fields for category, alcoholic, glass, and ingredients
    // Combines drink ingredients (id, measure) and ingredients aggregation (name, thumbnail)
    getAddFieldsAndCombineIngredients() {
        return { 
            $addFields: {
                category: "$category.name",
                alcoholic: "$alcoholic.name",
                glass: "$glass.name",
                ingredients: { $map: { // Combing ingredients and ingredientData 
                    input: "$ingredients",
                    as: "i",
                    in: {
                        ingredient: "$$i.ingredientId",
                        name: {
                            $arrayElemAt: [
                                { $map: {
                                    input: { "$filter": {
                                        input: "$ingredientData",
                                        as: "id",
                                        cond: { $eq: [ "$$id._id", "$$i.ingredientId"]}
                                    }},
                                    as: "id",
                                    in: "$$id.name"
                                }}, 0
                            ]
                        },
                        thumbnail: {
                            "$arrayElemAt": [
                                { "$map": {
                                    input: { "$filter": {
                                        input: "$ingredientData",
                                        as: "id",
                                        cond: { $eq: [ "$$id._id", "$$i.ingredientId"]}
                                    }},
                                    as: "id",
                                    in: "$$id.thumbnail"
                                }}, 0
                            ]
                        },
                        measure: "$$i.measure",
                        id: "$$i._id"
                    }}
                }
            }
        }
    }

    // Hide fields not needed for front-end
    hideFields() {
        return {
            $project: {
                "_id": 0,
                "__v": 0,
                "ingredientData": 0,
                "categoryId": 0,
                "glassId": 0,
                "alcoholicId": 0,
                "ingredients.ingredient": 0
            }
        }
    }

    // Clears database
    async clearData() {
        await this.category.deleteMany({});
        await this.alcoholic.deleteMany({});
        await this.glass.deleteMany({});
        await this.ingredient.deleteMany({});
        await this.drink.deleteMany({});
        return;
    }
}

module.exports = DB;