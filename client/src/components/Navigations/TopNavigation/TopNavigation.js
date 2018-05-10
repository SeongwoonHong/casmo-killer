import React, { Component } from 'react';

import AppTitle from '../shared/AppTitle';
import TopNavBtn from '../shared/TopNavBtn';

import './TopNavigation.scss';

class TopNavigation extends Component {

  render() {

    const { toggleMenu, toggleUserMenu } = this.props;

    return (
      <header className="Top-navigation">
        <div className="Top-navigation__row component-row">
          <TopNavBtn
            icon="dehaze"
            classPrefix="Top-navigation"
            onClick={ toggleMenu } />
          <AppTitle />
          <TopNavBtn
            icon="person_outline"
            classPrefix="Top-navigation"
            onClick={ toggleUserMenu } />
        </div>
      </header>
    );

  }

}

export default TopNavigation;
