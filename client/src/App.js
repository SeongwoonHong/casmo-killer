import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import * as actions from '@actions';
import breakPoint from '@sharedUtils/breakPoint';
import LoadingOverlay from '@sharedComponents/LoadingOverlay';
import { ToastContainer } from 'react-toastify';

import { MainMenuRoutes } from './routers';
import UserRoute from './routers/user';

import TopNavigation from './components/Navigations/TopNavigation';
import AppNavigation from './components/Navigations/AppNavigation';
import ErrorPage from './components/ErrorPage';
import UserInfoModal from './components/UserInfoModal';
import AuthLoader from './components/AuthLoader';

import './App.scss';

class App extends Component {

  componentDidMount() {

    const { layout, updateBreakpoint } = this.props;

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', (e) => {
        if (breakPoint(e.target.innerWidth) !== layout.breakPoint) {
          updateBreakpoint(breakPoint(e.target.innerWidth));
        }
      }, false);
    }

  }

  render() {

    const { layout, user } = this.props;

    return (
      <div className="root-container">
        <LoadingOverlay isVisible={ layout.isAppLoading } />
        <TopNavigation />
        <div className="app-container">
          <Route path="/" component={ AppNavigation } />
          <div className="component-row">
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
              <Route path="/user" component={ UserRoute } />
              <Route path="/error" component={ ErrorPage } />
              <Route component={ ErrorPage } />
            </Switch>
            {
              user.isModalOpened && <UserInfoModal />
            }
          </div>
        </div>
        <AuthLoader />
        <ToastContainer autoClose={3000} />
      </div>
    );

  }

}

const mapStateToProps = (state) => {
  return {
    layout: state.layout,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBreakpoint: size => dispatch(actions.updateBreakpoint(size))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
