import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classnames from 'classnames';
import axios from 'axios';
import * as actions from 'actions';
import './App.scss';

import TopNavigation from './components/Navigations/TopNavigation';
import MainMenu from './components/Navigations/MainMenu';
import AuthModal from './components/AuthModal';

import { MainMenuRoutes } from './routers';

import breakPoint from './utils/breakPoint';

class App extends Component {

  componentDidMount() {

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', (e) => {
        if (breakPoint(e.target.innerWidth) !== this.props.layout.breakPoint) {
          this.props.updateBreakPoint(breakPoint(e.target.innerWidth));
        }
      }, false);
    }

    axios.get('/api/user/validate').then((res) => {
      this.props.loginSuccess(res.data);
    });

  }

  componentWillUnmount() {

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', (e) => {
        this.props.updateBreakPoint(e.target.innerWidth);
      });
    }

  }

  render() {

    const { layout } = this.props;

    const RootComponents = MainMenuRoutes.map(route => (
      <Route
        key={ route.path }
        exact={ route.exact }
        path={ route.path }
        component={ route.main }
      />
    ));

    return (
      <div className="app">
        <TopNavigation />
        <div className={ classnames('app-wrapper', {
          widened: layout.isMainMenuVisible
        }) }>
          <Route path="/" component={ MainMenu } />
          <div className="container">
            <Switch>
              { RootComponents }
            </Switch>
            <AuthModal />
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
    loginSuccess: payload => dispatch(actions.loginSuccess(payload)),
    updateBreakPoint: (size) => {
      dispatch(actions.updateBreakPoint(size));
    },
    toggleMenu: () => {
      dispatch(actions.toggleMenu());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
