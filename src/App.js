import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './ pages/Home';
import Cart from './ pages/Cart';
import ProductItem from './ pages/ProductItem';

function App() {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={
          (params) => (
            <Home
              { ...params }
            />)
        }
      />
      <Route
        exact
        path="/cart"
        render={ (params) => <Cart { ...params } /> }
      />
      <Route exact path="/product/:id" component={ ProductItem } />
    </Switch>
  );
}

export default App;
