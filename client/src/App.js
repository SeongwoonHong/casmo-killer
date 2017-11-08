import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import './App.scss';
// import MainMenu from './components/MainMenu';
// import Login from './components/Login';
import Register from './components/Register/Register';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <MainMenu />
        <div className="login-wrapper">
          <Login />
        </div> */}
        <div className="register-wrapper">
          <Register />
        </div>
      </div>
    );
  }
}


export default App;
