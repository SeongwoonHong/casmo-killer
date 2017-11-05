import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.scss';
import MainMenu from './components/MainMenu';
import Community from './components/Community';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="row">
          <div className="col s12 m4 l3">
            <MainMenu />
          </div>
          <div className="col s12 m8 l9">
            <Route path="/community" component={Community} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
