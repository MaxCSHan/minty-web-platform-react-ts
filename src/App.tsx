import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './assets/App.css';
import Login from './view/login/index'
import Container from './view/auth'

const App: React.FC = ()=> {
  return (
    <Router>
      <div className="font-sans ">
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/Auth" component={Login}>
          </Route>
          <Route path="/" component={Container}>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
