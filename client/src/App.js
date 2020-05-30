import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import Header from './Components/Header/Header';
import { GetCocktailData, getDrinkDetails } from "./API";
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

  const handleGetRandomDrink = () => {
    var drinkIds = Object.keys(data.drinks);
    var randomDrink = data.drinks[drinkIds[drinkIds.length * Math.random() << 0]];
    setRedirect("/cocktail/"+randomDrink.id);
    setNewDrink(id);
    setCurrentDrink(randomDrink.id);
  }

  const handleGoBack = () => {
    setRedirect("/");
    setCurrentDrink(null);
  }

  const handleSelectDrink = (id) => {
    setRedirect(null);
    // setCurrentDrink(id);
    setNewDrink(id);
  }

  // Get data
  useEffect(() => {
    const fetchData = async () => {
      const test = await getDrinkDetails(17222);
      console.log(test);
      const data = await GetCocktailData();
      console.log(data);
      setData(data);
    }
    fetchData();
  }, []);

  // Check if url is valid
  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      const path = window.location.pathname;
      if (/^\/cocktail\/\d+$/.test(path)) {
        // Check that cocktail id exists
        var drinkId = path.split("/")[2];
        if (data.drinkIds.includes(drinkId)) {
          // setCurrentDrink(drinkId)
          setNewDrink(drinkId);
        } else {
          setRedirect("/");
        }
      }
    }
  }, [data]);

  const setNewDrink = async (id) => {
    var drink = await getDrinkDetails(id);
    setCurrentDrink(drink);
  }

  const renderCocktail = (routerProps) => {
    let cocktailId = routerProps.match.params.id;
    if (data.drinkIds.includes(cocktailId)) {
      return <CocktailDetail drink={data.drinks[cocktailId]} goBack={handleGoBack}/>;
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
                <Filters data={data} ref={filterRef}/>
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
