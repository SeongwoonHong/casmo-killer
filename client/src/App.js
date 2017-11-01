import React, { Component } from 'react';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.scss';

class App extends Component {
  componentDidMount() {
    axios.get('/api/test').then(res => console.log(res.data));
    console.log(process.env.REACT_APP_CUSTOM_ENV);
  }

  render() {
    const Home = () => (
      <div>
        <h2>Home</h2>
      </div>
    );

    const About = () => (
      <div>
        <h2>About</h2>
      </div>
    );

    const Topics = () => (
      <div>
        <h2>Topics</h2>
      </div>
    );

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/topics">Topics</Link></li>
          <li><Link to="/asdf">asdf</Link></li>
        </ul>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
        <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
