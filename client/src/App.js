import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.scss';
import PostList from './components/PostList';
import PostNew from './components/PostNew';
import PostShow from './components/PostShow';
import MainMenu from './components/MainMenu';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="row">
          <div className="col s12 m4 l1">
            <MainMenu />
          </div>
          <div className="col s12 m8 l11">
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/community" component={PostList} />
              <Route exact path="/community/post/new" component={PostNew} />
              <Route path="/community/post/:id" component={PostShow} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
