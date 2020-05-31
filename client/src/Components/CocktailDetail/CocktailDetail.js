import React from 'react';
import './CocktailDetail.scss';
import { TextField, Card, CardMedia, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Paper, Button} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

const CocktailDetail = (props) => {
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
            <Button className="goBack" variant="contained" color="primary" size="small" startIcon={<ArrowBackIos/>} onClick={props.goBack}>
                Go Back
            </Button>
            <Card className="header">
                <CardMedia className="thumbnail" image={props.drink.thumbnail}/>
                <div className="headerInfo">
                    <h1>{props.drink.name}</h1>
                    {renderFilter("Category", props.drink.category)}
                    {renderFilter("Glass", props.drink.glass)}
                    {renderFilter("Alcohol Content", props.drink.alcoholic)}
                </div>
            </Card>
            <Paper elevation={4} className="info">
                <div className="ingredients">
                    <h2>Ingredients</h2>
                    <List>
                        {props.drink.ingredients.map((ingredient, index) => {
                            var isFirst = index === 0;
                            return (
                                <ListItem alignItems="flex-start" key={ingredient.id}>
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
                    <p>{props.drink.instructions}</p>
                </div>
            </Paper>      
        </div>
    );
};

export default CocktailDetail;