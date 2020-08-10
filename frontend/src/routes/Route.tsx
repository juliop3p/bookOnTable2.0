import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}: RouteProps) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={() => {
        if (isPrivate && !!user) {
          return <Component />;
        }
        if (rest.path === '/signin' && !!user) {
          return <Redirect to={{ pathname: '/dashboard' }} />;
        }
        if (isPrivate && !user) {
          return <Redirect to={{ pathname: '/signin' }} />;
        }
        return <Component />;
      }}
    />
  );
};

export default Route;

Route.defaultProps = {
  isPrivate: false,
};
