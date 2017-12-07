import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import './UserMenu.scss';

class UserMenu extends Component {

  constructor(props) {

    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);

  }

  componentDidMount() {

    document.addEventListener('click', this.toggleDropdown, false);
    document.addEventListener('touchend', this.toggleDropdown, false);

  }

  componentWillUnmount() {

    document.removeEventListener('click', this.toggleDropdown, false);
    document.removeEventListener('touchend', this.toggleDropdown, false);

  }

  toggleDropdown(event) {

    console.log(ReactDOM.findDOMNode(this).contains(event.target));

    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      if (this.props.layout.isUserDropdownOpen) {
        setTimeout(() => {
          this.props.toggleUserDropdown(false);
        });
      }
    }

  }

  clickToToggle(event) {

    if (event.type === 'mousedown' && event.button !== 0) {
      console.log('fuck you');
      return;
    }

    console.log('shit');
    event.stopPropagation();
    event.preventDefault();

    this.props.toggleUserDropdown();

  }

  render() {

    const { user } = this.props;

    const Notifications = (isLoggedIn) => {
      if (isLoggedIn) {
        return (
          <Link
            to="/user/notifications"
            className="btn notification">
            <i className="material-icons">
              notifications_none
            </i>
            <span className="notification-badge">N</span>
          </Link>
        );
      }
      return null;
    };

    const UserProfile = currentUser => (
      <div
        role="button"
        tabIndex={ 0 }
        className={ classnames('user-profile', {
          loggedIn: user.isLoggedIn
        }) }
        onMouseDown={ this.clickToToggle.bind(this) }
        onTouchEnd={ this.clickToToggle.bind(this) }
        onKeyDown={ () => {} }>
        {
          currentUser.isLoggedIn
            ? (
              <div className="user-info">
                <div className="user-avatar">
                  {
                    currentUser.avatar
                      ? (
                        <img
                          src={ currentUser.avatar }
                          alt={ currentUser.username } />
                      )
                      : (
                        <span>
                          { currentUser.username[0] }
                        </span>
                      )
                  }
                </div>
                <div className="user-username">
                  <span>{ currentUser.username }</span>
                  <span>{ currentUser.level || 'newbie' }</span>
                </div>
              </div>
            )
            : null
        }
        <a className="btn dropdown-toggle">
          <i className="material-icons dd-toggler">
            {
              this.props.layout.isUserDropdownOpen
                ? 'arrow_drop_up'
                : 'arrow_drop_down'
            }
          </i>
        </a>
      </div>
    );

    return (
      <div className="user-menu">
        { Notifications(user.isLoggedIn) }
        { UserProfile(user) }
      </div>
    );

  }

}

export default UserMenu;
