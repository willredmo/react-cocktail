export const GetCocktailData = () => {
    const data = {
        drinks: {
            "1": {
                id: "1",
                name: "Mojito",
                category: "Cocktail",
                alcoholic: "Alcoholic",
                glass: "Highball glass",
                instructions: "Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice. Pour the rum and top with soda water. Garnish and serve with straw.",
                thumbnail: "https://www.thecocktaildb.com/images/media/drink/rxtqps1478251029.jpg",
                ingredients: [
                    {
                        name: "Light rum",
                        measure: "2-3 oz"
                    },
                    {
                        name: "Lime",
                        measure: "Juice of 1"
                    },
                    {
                        name: "Sugar",
                        measure: "2 tsp"
                    },
                    {
                        name: "Mint",
                        measure: "2-4"
                    },
                    {
                        name: "Soda water",
                        measure: "A splash"
                    },
                ],
                ingredientListFilter: [
                    "Light rum",
                    "Mint"
                ]
            },
            "2": {
                id: "2",
                name: "Old Fashioned",
                category: "Cocktail",
                alcoholic: "Alcoholic",
                glass: "Old-fashioned glass",
                instructions: "Place sugar cube in old fashioned glass and saturate with bitters, add a dash of plain water. Muddle until dissolved.\r\nFill the glass with ice cubes and add whiskey.\r\n\r\nGarnish with orange twist, and a cocktail cherry.",
                thumbnail: "https://www.thecocktaildb.com/images/media/drink/vrwquq1478252802.jpg",
                ingredients: [
                    {
                        name: "Bourbon",
                        measure: "4.5 cL"
                    },
                    {
                        name: "Angostura bitters",
                        measure: "2 dashes"
                    },
                    {
                        name: "Sugar",
                        measure: "1 cube"
                    },
                    {
                        name: "Water",
                        measure: "Dash"
                    }
                ],
                ingredientListFilter: [
                    "Bourbon",
                    "Angostura bitters"
                ]
            },
        },
        drinkIds: [
            "1",
            "2"
        ],
        ingredients: [
            "Bourbon",
            "Angostura bitters",
            "Light rum",
            "Mint"
        ],
        categories: [
            "Cocktails",
            "Shot"
        ],
        glasses: [
            "Old-fashioned glass",
            "Highball glass"
        ],
        alcoholicFilters: [
            "Alcoholic"
        ],
        nonFilterIngredients: [],
        totalDrinks: 2
    };

    return new Promise((res, rej) => {
        setTimeout(() => {
            res(data);
        }, 100);
    });
}