import 'materialize-css/dist/css/materialize.min.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.scss';
import MainMenu from './components/MainMenu';
import Login from './components/Login';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowLogin: false
    };
  }
  render() {
    return (
      <div className="App">
        <MainMenu />
        <button // temporary for now. will be removed later
          style={{
            position: 'absolute', top: '80%', left: '50%', transform: 'translate(-50%, -50%)'
          }}
          onClick={() => this.setState({ isShowLogin: !this.state.isShowLogin })}
        >
          LOGIN
        </button>
        {
          this.state.isShowLogin
          ?
            <div className="login-wrapper">
              <Login />
            </div>
          : null
        }
        <p style={{
          position: 'absolute', top: '10px', left: '70%', transform: 'translateY(-50%)'
        }}
        >
          <p>
            {
              this.props.auth.isLoggedIn
              ? 'Logged in'
              : 'Not logged in'
            }
          </p>
          <p>current user: {this.props.auth.currentUser}</p>
        </p>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  };
}

export default connect(mapStateToProps, null)(App);
