import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classnames from 'classnames';
import axios from 'axios';

import * as actions from 'actions';
import * as storage from 'sharedUtils/storage';
import breakPoint from 'sharedUtils/breakPoint';

import { MainMenuRoutes } from './routers';
import TopNavigation from './components/Navigations/TopNavigation';
import MainMenu from './components/Navigations/MainMenu';
import UserInfoModal from './components/UserInfoModal';

import './App.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.verifyLoginStatus = this.verifyLoginStatus.bind(this);
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', (e) => {
        if (breakPoint(e.target.innerWidth) !== this.props.layout.breakPoint) {
          this.props.updateBreakPoint(breakPoint(e.target.innerWidth));
        }
      }, false);
    }
    this.verifyLoginStatus();
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', (e) => {
        this.props.updateBreakPoint(e.target.innerWidth);
      });
    }
  }

  async verifyLoginStatus() {

    const user = await storage.get('ckUser');

    // initially set the user from the local storage
    if (user) {
      this.props.loginSuccess(user);
    }

    // update the user state from the fresh information from the server
    try {
      const { data } = await axios.get('/api/user/verify/status');
      if (data.user) {
        this.props.loginSuccess(data.user);
      }
    } catch (error) {
      // if token has expired, remove all user information
      storage.remove('ckUser');
    }

  }

  render() {

    const { layout } = this.props;

    return (
      <div className="root-container">
        <TopNavigation />
        <div className={ classnames('app-wrapper', {
          widened: layout.isMainMenuVisible
        }) }>
          <Route path="/" component={ MainMenu } />
          <div className="component-container">
            <Switch>
              {
                MainMenuRoutes.map(route => (
                  <Route
                    key={ route.path }
                    exact={ route.exact }
                    path={ route.path }
                    component={ route.main }
                  />
                ))
              }
            </Switch>
            <UserInfoModal />
          </div>
        </div>
      </div>
    );

  }

}

const mapStateToProps = (state) => {
  return {
    layout: state.layout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleMenu: () => dispatch(actions.toggleMenu()),
    updateBreakPoint: size => dispatch(actions.updateBreakPoint(size)),
    loginSuccess: payload => dispatch(actions.loginSuccess(payload))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
