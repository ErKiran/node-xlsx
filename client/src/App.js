import React from 'react';
import { Route, BrowserRouter, Switch } from 'react-router-dom';


import FileUpload from './components/FileUpload';
import './App.css';
import Navbar from './components/Navbar';
import Filter from './components/OrderFilter';
import Home from './components/Home';

const App = () => (
  <BrowserRouter>
  <Navbar />
    <Switch>
      <Route exact path = "/" component={Home}/>
      <Route exact path="/upload" component={FileUpload} />
      <Filter />
    </Switch>
  </BrowserRouter>
);

export default App;
