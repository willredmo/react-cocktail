import React, { useState } from 'react';
import './CocktailList.scss';
import { Card, CardActionArea, Typography, CardMedia  } from '@material-ui/core';
import { Link } from "react-router-dom";

const CocktailList = (props) => {

    return (
        <div id="CocktailList">
            {Object.keys(props.drinks).map((key, index) => {
                const drink = props.drinks[key];
                const className = props.currentDrink === drink.id ? "active" : "";
                return (
                    <CocktailItem className={className} key={drink.id} drink={drink} onClick={props.selectDrink}/>
                );
            })}
        </div>
    );
};

const CocktailItem = (props) => {
    return (
        <Card className={"CocktailItem "+ props.className}>
            <Link to={"/cocktail/"+props.drink.id} onClick={() => { props.onClick(props.drink.id) }}>
                <CardActionArea>
                    <CardMedia
                        className="thumbnail"
                        image={props.drink.thumbnail}
                    />
                    <Typography className="drinkName" gutterBottom variant="h5" component="h2">
                        {props.drink.name}
                    </Typography>
                </CardActionArea>
            </Link>
        </Card>
    );
};

export default CocktailList;