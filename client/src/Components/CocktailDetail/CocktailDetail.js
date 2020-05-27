import React, { useState } from 'react';
import './CocktailDetail.scss';
import { TextField, Card, CardMedia, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Paper } from '@material-ui/core';

const CocktailDetail = ({ drink }) => {
    const renderFilter = (filter, value) => {
        return (
            <TextField
                className="filter"
                disabled
                label={filter}
                defaultValue={value}
                variant="outlined"
            />
        )
    }
    
    return (
        <div id="drinkDetail">
            <Card className="header">
                <CardMedia className="thumbnail" image={drink.thumbnail}/>
                {/* <div className="img" style={backgroundImg}></div> */}
                <div className="headerInfo">
                    <h1>{drink.name}</h1>
                    {renderFilter("Category", drink.category)}
                    {renderFilter("Glass", drink.glass)}
                    {renderFilter("Alcohol Content", drink.alcoholic)}
                </div>
            </Card>
            <Paper elevation={4} className="info">
                <div className="ingredients">
                    <h2>Ingredients</h2>
                    <List>
                        {drink.ingredients.map((ingredient, index) => {
                            var isFirst = index === 0;
                            return (
                                <ListItem alignItems="flex-start" key={ingredient.name}>
                                    {!isFirst && <Divider/>}
                                    <ListItemAvatar>
                                        <Avatar src={"https://www.thecocktaildb.com/images/ingredients/"+ingredient.name+".png"} />
                                    </ListItemAvatar>
                                    <ListItemText className="text" primary={ingredient.name} secondary={ingredient.measure}/>
                                </ListItem>
                            )    
                        })}
                    </List>
                </div>
                <div className="instructions">
                    <h2>Instructions</h2>
                    <p>{drink.instructions}</p>
                </div>
            </Paper>      
        </div>
    );
};

export default CocktailDetail;