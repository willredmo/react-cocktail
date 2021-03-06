import React, { useEffect, useState, useRef, useCallback } from 'react';
import './App.scss';
import Header from './Components/Header/Header';
import { getAllData, getDrinkDetails, getRandomDrinkDetails, getFilteredDrinks } from "./API";
import CocktailDetail from './Components/CocktailDetail/CocktailDetail';
import CocktailList from './Components/CocktailList/CocktailList';
import Filters from './Components/Filters/Filters';
import { BrowserRouter as Router, Switch, Route, Redirect  } from "react-router-dom";
import { MenuOpen } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import  { red, blue } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const App = () => {
  const filterRef = useRef();

  const [loaded, setloaded] = useState(false);
  const [drinks, setDrinks] = useState([]);
  const [filters, setFilters] = useState({});
  const [totalDrinks, setTotalDrinks] = useState(0);
  const [redirect, setRedirect] = useState(null);
  const [currentDrink, setCurrentDrink] = useState(null);

    // Does once at start of app
    useEffect(() => {
      // Sets current drink according url params
      const getCocktialFromParam = async () => {
        const path = window.location.pathname;
        if (/^\/\d+$/.test(path)) {
          var drinkId = path.split("/")[1];
          var drink = await getDrinkDetails(drinkId);
          if (drink.hasOwnProperty("message")) {
            console.log(drink.message);
            setRedirect("/");
          } else {
            setCurrentDrink(drink);
          }
        }
      }
      
      // Gets drink list and 
      const fetchData = async () => {
        const data = await getAllData();
        setTotalDrinks(data.drinks.length);
        setFilters(data.filters);
        setDrinks(data.drinks);
        setloaded(true);
      }
  
      fetchData();
      getCocktialFromParam();
    }, []);

  // Sets url to current drink which tells router to render current drink
  useEffect(() => {
    if (currentDrink != null) {
      setRedirect("/"+currentDrink.id);
    }
  }, [currentDrink]);

  const handleGetRandomDrink = async () => {
    var drink = await getRandomDrinkDetails();
    setCurrentDrink(drink);
  }

  const handleGoBack = () => {
    setRedirect("/");
    setCurrentDrink(null);
  }

  const handleSelectDrink = async (id) => {
    setRedirect(null);
    var drink = await getDrinkDetails(id);
    setCurrentDrink(drink);
  }
  // To prevent list from reloading with unlrelated props
  const memorizedSelectDrink = useCallback(handleSelectDrink, []);

  const renderCocktail = (routerProps) => {
    if (currentDrink != null) {
      return <CocktailDetail drink={currentDrink} goBack={handleGoBack}/>;
    }
  };

  const handleSendFilters = async (filters) => {
    const drinks = await getFilteredDrinks(filters);
    console.log(drinks);
    setDrinks(drinks);
    setTotalDrinks(drinks.length);
  }

  const memorizedSendFilters = useCallback(handleSendFilters, []);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[600]
      },
      secondary: {
        main: red[500]
      }
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Header handleClick={handleGetRandomDrink}/>
          {loaded ?
            <div id="content" className={currentDrink !== null ? "showingDrink" : "" }>
              <div id="left">
                <Filters data={{
                  categories: filters.categories,
                  ingredients: filters.ingredients,
                  glasses: filters.glasses,
                  alcoholicFilters: filters.alcoholicFilters
                }} ref={filterRef} sendFilters={memorizedSendFilters}/>
                <div className="filterTotalDrinks">
                  <Button className="showFilters" variant="contained" color="primary" size="small" startIcon={<MenuOpen/>} onClick={() => filterRef.current.open()}>
                    Filters
                  </Button>
                  <span className="totalDrinks">Cocktails: {totalDrinks}</span>
                </div>
                <CocktailList drinks={drinks} selectDrink={memorizedSelectDrink}/>
              </div>
              <div id="right">
                {redirect !== null &&
                  <Redirect to={redirect} />
                }
                <Switch>
                  <Route path="/:id" render={renderCocktail} />
                  <Route path="/">
                    <div className="selectCocktail">
                      <h1>Please Select a Cocktail to View Its Details</h1>
                    </div>
                  </Route>
                </Switch>
              </div>
            </div>
          : <h1>Loading Data</h1> }
      </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
