import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import './App.scss';
import MainMenu from './components/MainMenu';
import TopNavigation from './components/TopNavigation';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TopNavigation />
        <MainMenu />
      </div>
    );
  }
}

export default App;
