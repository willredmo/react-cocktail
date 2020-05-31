import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import Header from './Components/Header/Header';
import { getAllData, getDrinkDetails, getRandomDrinkDetails } from "./API";
import CocktailDetail from './Components/CocktailDetail/CocktailDetail';
import CocktailList from './Components/CocktailList/CocktailList';
import Filters from './Components/Filters/Filters';
import { BrowserRouter as Router, Switch, Route, Redirect  } from "react-router-dom";
import { MenuOpen } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import  { teal, blue } from '@material-ui/core/colors';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const App = () => {
  const filterRef = useRef();

  const [data, setData] = useState({});
  const [redirect, setRedirect] = useState(null);
  const [currentDrink, setCurrentDrink] = useState(null);

    // Does once at start of app
    useEffect(() => {
      // Sets current drink according url params
      const getCocktialFromParam = async () => {
        const path = window.location.pathname;
        if (/^\/cocktail\/\d+$/.test(path)) {
          var drinkId = path.split("/")[2];
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
        console.log(data);
        setData(data);
      }
  
      fetchData();
      getCocktialFromParam();
    }, []);

  // Sets url to current drink which tells router to render current drink
  useEffect(() => {
    if (currentDrink != null) {
      setRedirect("/cocktail/"+currentDrink.id);
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

  const renderCocktail = (routerProps) => {
    if (currentDrink != null) {
      return <CocktailDetail drink={currentDrink} goBack={handleGoBack}/>;
    }
  };

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: blue[600]
      },
      secondary: {
        main: teal[900]
      }
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Header handleClick={handleGetRandomDrink}/>
          {Object.keys(data).length !== 0 &&
            <div id="content" className={currentDrink !== null ? "showingDrink" : "" }>
              <div id="left">
                <Filters data={{
                  categories: data.filters.categories,
                  ingredients: data.filters.ingredients,
                  glasses: data.filters.glasses,
                  alcoholicFilters: data.filters.alcoholicFilters
                }} ref={filterRef}/>
                <div className="filterTotalDrinks">
                  <Button className="showFilters" variant="contained" color="primary" size="small" startIcon={<MenuOpen/>} onClick={() => filterRef.current.handleShowFilters()}>
                    Filters
                  </Button>
                  <span className="totalDrinks">Cocktails: {data.totalDrinks}</span>
                </div>
                <CocktailList drinks={data.drinks} selectDrink={handleSelectDrink} currentDrink={currentDrink}/>
              </div>
              <div id="right">
                {redirect !== null &&
                  <Redirect to={redirect} />
                }
                <Switch>
                  <Route path="/cocktail/:id" render={renderCocktail} />
                  <Route path="/">
                    <div className="selectCocktail">
                      <h1>Please Select a Cocktail to View Its Details</h1>
                    </div>
                  </Route>
                </Switch>
              </div>
            </div>
          }
          {Object.keys(data).length === 0 &&
            <h1>Loading Data</h1>
          }
      </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
