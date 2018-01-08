import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classnames from 'classnames';

import * as actions from 'actions';
import breakPoint from 'sharedUtils/breakPoint';

import { MainMenuRoutes } from './routers';

import TopNavigation from './components/Navigations/TopNavigation';
import MainMenu from './components/Navigations/MainMenu';
import NotFound from './components/NotFound';
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

    const { layout } = this.props;

    return (
      <div className="root-container">
        <TopNavigation />
        <div className="app-wrapper">
          <Route path="/" component={ MainMenu } />
          <div className={ classnames('component-container', {
            widened: layout.isMainMenuVisible
          }) }>
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
              <Route component={ NotFound } />
            </Switch>
            <UserInfoModal />
          </div>
        </div>
        <AuthLoader />
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
    updateBreakpoint: size => dispatch(actions.updateBreakpoint(size))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
