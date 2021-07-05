import {createElement} from 'react';
import { Route,Redirect } from 'react-router-dom';


/**
 * 
 * @param component @param isAuthenticated
 * @returns 
 */
const PrivateRoute = ({component, isAuthenticated, ...rest}: any) => {
    const routeComponent = (props: any) => isAuthenticated? createElement(component, props): <Redirect to={{pathname: '/auth'}}/>;
    return <Route {...rest} render={routeComponent}/>;
};
export default PrivateRoute;