import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import './App.scss';
import MainMenu from './components/MainMenu';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MainMenu />
      </div>
    );
  }
}


export default App;
