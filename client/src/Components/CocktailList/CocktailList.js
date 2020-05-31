import React, { useState, useEffect } from 'react';
import './CocktailList.scss';
import { Card, CardActionArea, Typography, CardMedia  } from '@material-ui/core';
import { Link } from "react-router-dom";

const CocktailList = (props) => {
    const maxItemsDisplayed = 12;
    const itemTopMargin = 5;
    const [showIndexes, setShowIndexes] = useState([]);
    const [itemHeight, setItemHeight] = useState(200);
    

    window.addEventListener('resize', (event) => {
        if (window.innerWidth > 700) {
            setItemHeight(200);
        } else {
            setItemHeight(300);
        }
    });

    useEffect(() => {
        init();
    },[]);

    const init = () => {
        const hasProps = props != null;
        if (!hasProps) {
            setTimeout(() => { init()}, 100);
        } else {
            if (window.innerWidth > 700) {
                setItemHeight(200);
            } else {
                setItemHeight(300);
            }
            // Display first group of drinks
            var temp = [];
            for (var i = 0; i < maxItemsDisplayed; i++) {
                temp.push(i);
            }
            setShowIndexes(temp);
        }
    }


    // Dont show every element to speed up app
    const handleScroll = (event) => {
        const totalItems = props.drinks.length;
        const listElement = event.target;
        const scrollTop = listElement.scrollTop;
        // const scrollHeight = listElement.scrollHeight;
        // const listHeight = listElement.clientHeight;

        const totalItemHeight = (itemHeight + itemTopMargin)
        const middleIndex = Math.floor(scrollTop / totalItemHeight);
        var start = middleIndex - (maxItemsDisplayed/2),
            end = middleIndex + (maxItemsDisplayed/2);
        if (start < 0) {
            start = 0;
        }
        if (end > totalItems - 1) {
            end = totalItems - 1;
        }
        var temp = [];
        for (var i = start; i <= end; i++) {
            temp.push(i);
        }
        setShowIndexes(temp);
    };

    const FillerHeight = {
        height: (itemHeight + itemTopMargin) * props.drinks.length + "px"
    }

    return (
        <div id="CocktailList" onScroll={handleScroll}>
            {Object.keys(props.drinks).map((key, index) => {
                var show = false;
                // console.log(itemHeight);
                if (showIndexes.length > 0) {
                    if (showIndexes.includes(index)) {
                        show = true;
                    }
                }
                const drink = props.drinks[key];
                var className = "";
                if (props.currentDrink !== null) {
                    className = props.currentDrink.id === drink.id ? "active" : "";
                }
                var top = {top: (itemHeight + itemTopMargin) * index + "px"};
                if (!show) {
                    return;
                }
                return (
                    <CocktailItem top={top} className={className} key={drink.id} drink={drink} onClick={props.selectDrink}/>
                );
            })}
            <div className="filler" style={FillerHeight}></div>
        </div>
    );
};

const CocktailItem = (props) => {
    return (
        <Card style={props.top} className={"CocktailItem "+ props.className}>
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