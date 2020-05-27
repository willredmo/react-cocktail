import React, { useEffect, useState } from 'react';
import './App.scss';
import Header from './Components/Header/Header';
import { GetCocktailData } from "./API";
import CocktailDetail from './Components/CocktailDetail/CocktailDetail';
import CocktailList from './Components/CocktailList/CocktailList';
import Filters from './Components/Filters/Filters';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

const App = () => {
  const [data, setData] = useState({});
  const [redirect, setRedirect] = useState(null);

  const handleGetRandomDrink = () => {
    var drinkIds = Object.keys(data.drinks);
    var randomDrink = data.drinks[drinkIds[ drinkIds.length * Math.random() << 0]];
    setRedirect("/cocktail/"+randomDrink.id);
  }

  const handleSelectDrink = () => {
    console.log("Select Drink Click");
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await GetCocktailData();
      console.log(data);
      setData(data);
    }
    fetchData();
  }, []);

  const renderCocktail = (routerProps) => {
    let cocktailId = routerProps.match.params.id;
    return <CocktailDetail drink={data.drinks[cocktailId]}/>;
  };

  return (
    <div className="App">
      <Router>
        <Header handleClick={handleGetRandomDrink}/>
        {Object.keys(data).length !== 0 &&
          <div id="content">
            <div id="left">
              <Filters data={data}/>
              <span className="totalDrinks">Cocktails: {data.totalDrinks}</span>
              <CocktailList drinks={data.drinks} selectDrink={handleSelectDrink}/>
            </div>
            <div id="right">
              {redirect !== null &&
                <Redirect to={redirect} />
              }
              <Switch>
                <Route path="/cocktail/:id" render={renderCocktail} />
                <Route path="/">
                  <div>
                    <h1>Please select a cocktail</h1>
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
    </div>
  );
}

export default App;
