import React,{useEffect, useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  // Route,
  // useLocation
} from "react-router-dom";
import './assets/App.css';
import Login from './view/login/index'
// import Onboarding from './view/login/onboarding'

import Container from './view/auth'
import PrivateRoute from "./router/PrivateRoute"
import { isLoggedIn ,firbaseAuth } from "./services/authService"


// interface stateType {
//   from: { pathname: string }
// }
const App: React.FC = ()=> {
  const [isAuthenticated,setIsAuthenticated] =useState(isLoggedIn());
  useEffect(()=> {setIsAuthenticated(isLoggedIn())},[])

  firbaseAuth.onAuthStateChanged((user)=> { setIsAuthenticated(isLoggedIn() || user!==null)})
  // type locationState ={
  //   from:string
  // }
  // const location = useLocation<stateType>();
  // const from = location?.state?.from; 

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
        <PrivateRoute isAuthenticated={!isAuthenticated} component={Login} path="/auth" redirectTo={"/"} />
        <PrivateRoute isAuthenticated={isAuthenticated} component={Container} path={"/"}   />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
