import React, { useState } from 'react';
import cx from 'classnames';
import { Button } from '~components';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Router, { withRouter } from 'next/router'
import { logout as logoutAction } from '~store/modules/auth';
import HamburgerMenu from './HamburgerMenu';

const sections = [
  {
    id: '/trending',
    label: 'Trending',
  },
  {
    id: '/latest',
    label: 'Latest',
  },
  {
    id: '/tags',
    label: 'Tags',
  }
]

const Header = props => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  function hamburgerMenuOnClick() {
    setIsMenuOpened(!isMenuOpened);
  }

  function gotoTrending() {
    Router.push('/trending');
  }

  function logout() {
    dispatch(logoutAction());
    setIsMenuOpened(false);
  }

  return (
    <div className="Header">
      <div className="top-header">
        <HamburgerMenu
          onClick={hamburgerMenuOnClick}
          isOpened={isMenuOpened}
        />
        <Button
          className="bg-transparent"
          onClick={gotoTrending}
        >
          DAMSO
        </Button>
      </div>
      <div className="sub-header">
        {
          sections.map((section) => {
            return (
              <Link
                href={section.id}
                key={section.id}
              >
                <div className={cx('sub-header-section', { active: section.id === `/${props.router.pathname.split('/')[1]}` })}>
                  {section.label}
                </div>
              </Link>
            );
          })
        }
      </div>
      <div className={cx('header-side-menu-wrapper', { isOpened: isMenuOpened })}>
        <div className="header-side-menu">
          <div className="side-menu-content">
            {
              user ? (
                <div className="side-menu-item" onClick={logout}>
                  LOG OUT
                </div>
              ) : (
                <Link href="/login">
                  <div className="side-menu-item">
                    LOGIN
                  </div>
                </Link>
              )
            }
            <Link href="/settings">
              <div className="side-menu-item">
                SETTINGS
              </div>
            </Link>
            <Link href="/contact">
              <div className="side-menu-item">
                CONTACT
              </div>
            </Link>
          </div>
        </div>
        <div
          className="background-overlay"
          onClick={() => setIsMenuOpened(false)}
        />
      </div>
    </div>
  );
};

const wrappedComponent = withRouter(Header);

export { wrappedComponent as Header };
