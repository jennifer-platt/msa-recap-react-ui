import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Navigation } from './components';

function App() {

  return (
    <Router>
      <Navigation />
      <Switch>
        <Route path="/" exact component={() => <Home />} />
      </Switch>
    </Router>
  );
}

export default App;
