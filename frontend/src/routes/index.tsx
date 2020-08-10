import React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import Home from '../pages/Home';
import Content from '../pages/Content';
import SignIn from '../pages/SignIn';

import Dashboard from '../pages/Dashboard';
import FormPost from '../pages/FormPost';
import FormCategory from '../pages/FormCategory';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/content" component={Content} />
    <Route path="/signin" component={SignIn} />

    <Route path="/dashboard" component={Dashboard} isPrivate />
    <Route path="/formpost" component={FormPost} isPrivate />
    <Route path="/formcategory" component={FormCategory} isPrivate />
  </Switch>
);

export default Routes;
