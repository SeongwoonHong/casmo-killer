import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as actions from '@actions';


import ErrorPage from '../../components/ErrorPage';
import Info from './Info';

import './User.scss';

class User extends Component {

  render() {

    const { user, registerRedirectUrl } = this.props;

    return (
      <div className="User">
        <Switch>
          <Route path="/user/info/:userId" component={ Info } />
          <Route component={ ErrorPage } />
        </Switch>
      </div>
    );
  }

}

export default connect(
  state => ({
    user: state.user
  }),
  dispatch => ({
    registerRedirectUrl: url => dispatch(actions.registerRedirectUrl(url))
  })
)(User);
