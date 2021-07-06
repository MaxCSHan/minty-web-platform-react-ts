import {useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from "./auth/"


const Login  = ()=> {
  useEffect(()=> console.log("Login desu"),[])

  return (
    <BrowserRouter>
        <Switch>
        <Route  component={Auth} path="/auth" exact />
        </Switch>
        </BrowserRouter>
  );
}

export default Login;