import {useEffect} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from "./auth/"
import Onboarding from "./onboarding"


const Login  = ()=> {
  useEffect(()=> console.log("Login desu"),[])

  return (
    <BrowserRouter>
        <Switch>
        <Route  component={Auth} path="/auth" exact />
        <Route  component={Onboarding} path="/auth/onboarding"  exact/>

        </Switch>
        </BrowserRouter>
  );
}

export default Login;