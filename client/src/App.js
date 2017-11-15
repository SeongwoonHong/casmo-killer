import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import classnames from 'classnames';
import * as actions from './actions';
import './App.scss';

import TopNavigation from './components/TopNavigation';
import MainMenu from './components/MainMenu';
import { MainMenuRoutes } from './routers';
import Login from './components/Login';
import Board from './components/Community/Board';
import PostNew from './components/Community/PostNew';
import PostDetail from './components/Community/PostDetail';

class App extends Component {

  componentDidMount() {

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', (e) => {
        this.props.updateBreakPoint(e.target.innerWidth);
      }, false);
      this.props.updateBreakPoint(window.innerWidth);
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
        <TopNavigation />
        <div className={ classnames('app-wrapper', {
          widened: this.props.layout.isMainMenuVisible
        }) }>
          <Route path="/" component={ MainMenu } />
          <div className="container">
            <div className="component-wrapper">
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
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/community/:boardId/board/new" component={PostNew} />
                <Route path="/community/:boardId/board/show/:postId" component={PostDetail} />
                <Route path="/community/:boardId/board" component={Board} />
              </Switch>
            </div>
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
    updateBreakPoint: (width) => {
      if (width <= 575) {
        dispatch(actions.updateBreakPoint('xs'));
      } else if (width > 575 && width <= 767) {
        dispatch(actions.updateBreakPoint('sm'));
      } else if (width > 767 && width <= 991) {
        dispatch(actions.updateBreakPoint('md'));
      } else if (width > 991 && width <= 1199) {
        dispatch(actions.updateBreakPoint('lg'));
      } else if (width > 1199) {
        dispatch(actions.updateBreakPoint('xl'));
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
