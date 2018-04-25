import React from 'react';
import { Link } from 'react-router-dom';

import logo from '@assets/logo.svg';

import './AppTitle.scss';

const AppTitle = () => {

  return (
    <h1 className="App-title">
      <Link to="/" className="App-title__link">
        <img
          src={ logo }
          alt="Damso Logo"
          className="App-title__img"
        />
      </Link>
    </h1>
  );

};

export default AppTitle;
