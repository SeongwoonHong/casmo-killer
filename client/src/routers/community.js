/* eslint no-unused-vars: 0 */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '@actions';
import PrivateRoute from '@sharedComponents/PrivateRoute/PrivateRoute';

import CommunityAll from '../containers/CommunityAll';
// import Articles from '../containers/Articles';
// import PostNew from './PostNew';
import ArticlesNew from '../containers/ArticlesNew';
// import PostDetail from './PostDetail';
import CommunityLanding from '../containers/CommunityLanding';

class Community extends Component {

  render() {

    const { user, registerRedirectMessage } = this.props;

    return (
      <div className="community">
        <Switch>
          <Route path="/community/communityAll" component={ CommunityAll } />
          <PrivateRoute
            path="/community/myCommunity"
            isLoggedIn={ user.isLoggedIn }
            component={ CommunityAll }
            componentProps={ { type: 'bookmark' } }
            onEnter={ msg => registerRedirectMessage(msg) } />
          <PrivateRoute
            path="/community/myCommunity"
            isLoggedIn={ user.isLoggedIn }
            component={ CommunityAll }
            componentProps={ { type: 'my' } }
            onEnter={ msg => registerRedirectMessage(msg) } />
          <Route path="/community/new" component={ ArticlesNew } />
          <Route path="/community/free" render={ () => <Redirect to="/articles/free" /> } />
          <Route path="/community" component={ CommunityLanding } />
          { /* <Route path="/community/newboard" component={BoardNew} /> */ }
          { /* <Route path="/articles/:boardId/new" component={RequireAuthentication(PostNew, '/community/communityAll')} /> */ }
          { /* <Route path="/article/:postId" component={PostDetail} /> */ }
          { /* <Route path="/articles/:boardId" component={Articles} /> */ }
          { /* <Route path="/" component="" /> */ }
        </Switch>
      </div>
    );

  }

}

export default connect(
  state => ({
    user: state.user.user
  }),
  dispatch => ({
    registerRedirectMessage: msg => dispatch(actions.registerRedirectMessage(msg))
  })
)(Community);
