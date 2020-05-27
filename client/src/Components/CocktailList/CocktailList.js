import React, { useState } from 'react';
import './CocktailList.scss';
import { Card, CardActionArea, Typography, CardMedia  } from '@material-ui/core';
import { Link } from "react-router-dom";

const CocktailList = ({ drinks }) => {
    // const [greeting, setGreeting] = useState("Create Cocktails");
    return (
        // Content
        <div id="CocktailList">
            {Object.keys(drinks).map((key, index) => {
                const drink = drinks[key];
                return (
                    <CocktailItem key={drink.id} drink={drink}/>
                );
            })}
        </div>
    );
};

const CocktailItem = ({ drink }) => {
    return (
        <Card className="CocktailItem">
            <Link to={"/cocktail/"+drink.id}>
                <CardActionArea>
                    <CardMedia
                        className="thumbnail"
                        image={drink.thumbnail}
                    />
                    <Typography className="drinkName" gutterBottom variant="h5" component="h2">
                        {drink.name}
                    </Typography>
                </CardActionArea>
            </Link>
        </Card>
    );
};

export default CocktailList;