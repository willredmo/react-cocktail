import React, { memo } from 'react';
import './CocktailList.scss';
import { Card, CardActionArea, Typography, CardMedia  } from '@material-ui/core';
import { Link } from "react-router-dom";
import { VariableSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const MARGIN = 5;

const CocktailList = (props) => {
    const getItemHeight = () => {
        if (window.innerWidth > 700 && window.innerWidth < 1300) {
            return 210;
        }
        return 310;
    }

    var listRef = React.createRef();

    window.addEventListener('resize', (event) => {
        if (listRef.current != null) {
            listRef.current.resetAfterIndex(0);
        }
    });


    const getStyle = (style) => {
        if (style.bottom === undefined) {
            style.bottom = 0;
        }
        const styles = {
            ...style,
            top: style.top + MARGIN,
            bottom: style.bottom + MARGIN,
            left: style.left + MARGIN,
            right: style.left + MARGIN,
            width: "calc("+style.width+"-"+(MARGIN + MARGIN)+"px)",
            height: style.height - (MARGIN + MARGIN)
        }
        return styles;
    }


    const CocktailItem = ({ index, style }) => {
        const drink = props.drinks[index];
    
        return (
            <Card style={getStyle(style)} 
                className={"CocktailItem"}>
                <Link to={"/"+drink.id} onClick={() => { props.selectDrink(drink.id) }}>
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

    return (
        <div id="CocktailList">
            <AutoSizer>
                {({ height, width }) => (
                    <VariableSizeList
                        ref={listRef}
                        height={height}
                        itemCount={props.drinks.length}
                        itemSize={getItemHeight}
                        width={width}
                    >
                        {CocktailItem}
                    </VariableSizeList>
                )}
                
            </AutoSizer>
        </div>
    );
};



export default memo(CocktailList);