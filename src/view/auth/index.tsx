import Home from "./home/index";
import User from "./user/index";

import Navbar from "../../component/Navebar";
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

const Container = () => {
  return (
    <div className="h-screen transition duration-100 ease-in-out">
      <Navbar></Navbar>
      <div className="">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/User">
            <User />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default Container;
