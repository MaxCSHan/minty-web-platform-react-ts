import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './assets/App.css';
import Login from './view/login/index'
import Home from './view/auth/home/index'

const App: React.FC = ()=> {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/Home">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
