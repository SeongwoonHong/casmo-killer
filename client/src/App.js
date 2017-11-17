import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import classnames from 'classnames';
import * as actions from './actions';
import './App.scss';

import TopNavigation from './components/Navigations/TopNavigation';
import MainMenu from './components/Navigations/MainMenu';
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
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', (e) => {
        this.props.updateBreakPoint(e.target.innerWidth);
      });
    }
  }

  render() {

    return (
      <div className="app">
        <div
          className={ classnames('main-menu-backdrop', {
            active: this.props.layout.isMainMenuVisible
          }) }
          role="button"
          tabIndex={ 0 }
          onClick={ this.props.toggleMenu }
          onKeyDown={ () => {
          } }
        />
        <TopNavigation />
        <div className={ classnames('app-wrapper', {
          widened: this.props.layout.isMainMenuVisible
        }) }>
          <Route path="/" component={ MainMenu } />
          <div className="container">
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
    updateBreakPoint: (size) => {
      dispatch(actions.updateBreakPoint(size));
    },
    toggleMenu: () => dispatch(actions.toggleMenu())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
