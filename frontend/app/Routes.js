import React from 'react';
import { Router, Route, hashHistory, IndexRedirect, IndexRoute, applyRouterMiddleware } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { useScroll } from 'react-router-scroll';

import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import User from './pages/User';
import Job from './pages/Job';
import Channel from './pages/Channel';

require('react-tap-event-plugin')();
require('normalize-css');


const Routes = (props, context) => {
  const { store } = context;
  const historyStore = syncHistoryWithStore(hashHistory, store);
  const auth = {
    loginRequired: (nextState, replace) => {
      if (!store.getState().auth.token) {
        replace('/login');
      }
    }
  };
  return (
    <Router history={historyStore} render={applyRouterMiddleware(useScroll())}>
      <Route path="/" component={App}>
        <IndexRedirect to="/login" />
        <Route path="login" component={Login} />
        <Route path="register" component={Register} />
        <Route path="user/:uid" component={User} />
        <Route path="newjob" component={Job.Edit} />
        <Route path="job/:jid">
          <IndexRoute component={Job.View} />
          <Route path="edit" component={Job.Edit} />
        </Route>
        <Route path="channel" onEnter={auth.loginRequired}>
          <IndexRoute component={Channel} />
          <Route path=":cid" component={Channel} />
        </Route>
      </Route>
    </Router>
  );
};

Routes.contextTypes = {
  store: React.PropTypes.object.isRequired
};

export default Routes;
