import React from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { withRouter } from 'next/router'
import HamburgerMenu from './HamburgerMenu';

const sections = [
  {
    id: 'trending',
    label: 'Trending',
  },
  {
    id: 'latest',
    label: 'Latest',
  },
  {
    id: 'tags',
    label: 'Tags',
  }
]

const Header = props => {
  return (
    <div className="Header">
      <div className="top-header">
        <div className="main-text">DASMO</div>
        <HamburgerMenu />
      </div>
      <div className="sub-header">
        {
          sections.map((section) => {
            return (
              <Link
                href={section.id}
                key={section.id}
              >
                <div className={cx('sub-header-section', { active: section.id === props.router.pathname.split('/')[1] })}>
                  {section.label}
                </div>
              </Link>
            );
          })
        }
      </div>
    </div>
  );
};

const wrappedComponent = withRouter(Header);

export { wrappedComponent as Header };
