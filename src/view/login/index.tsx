import {useEffect} from 'react';
import {  Route, Switch } from 'react-router-dom';
import Auth from "./auth"


const Login  = ()=> {
  useEffect(()=> console.log("Login desu"),[])

  return (
        <Switch>
        <Route  component={Auth} path="/auth" exact />
        </Switch>
  );
}

export default Login;