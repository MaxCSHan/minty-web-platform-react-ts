import {createElement} from 'react';
import { Route,Redirect } from 'react-router-dom';


/**
 * 
 * @param component @param isAuthenticated @param redirectTo
 * @returns 
 */
const PrivateRoute = ({component, isAuthenticated, redirectTo ="/auth", ...rest}: any) => {
    const routeComponent = (props: any) => isAuthenticated? createElement(component, props): <Redirect push to={{pathname: redirectTo}}/>;
    return <Route {...rest} render={routeComponent}/>;
};
export default PrivateRoute;