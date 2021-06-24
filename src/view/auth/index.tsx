import Home from "./home/index";
import User from "./user/index";

import Navbar from "../../component/Navebar";

// import {withRouter} from 'react-router';

import {
    // BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";

const Container = () => {
  return (
    <div className="h-screen transition duration-100 ease-in-out">
      <Navbar></Navbar>
      <div className="">
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route  path="/User" component={User}/>
        </Switch>
      </div>
    </div>
  );
};

export default Container;
