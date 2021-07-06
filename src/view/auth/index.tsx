import Home from "./home/index";
import User from "./user/index";
import Chat from "./chat/index";
import Search from "./search";
import Onboarding from "../login/onboarding"

import Navbar from "../../component/Navebar";

// import {withRouter} from 'react-router';

import { Switch, Route,} from "react-router-dom";

const Container = () => {
  return (
    <div className="h-screen  w-screen flex flex-col  items-center transition duration-100 ease-in-out">
      <Navbar ></Navbar>
      <div className="flex flex-grow">
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route  path="/Onboarding" component={Onboarding} exact/>
          <Route  path="/Search" component={Search}/>
          <Route  path="/User" component={User}/>
          <Route  path="/Chat" component={Chat}/>
        </Switch>
      </div>
    </div>
  );
};

export default Container;
