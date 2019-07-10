import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Routes from './routes';
import prototypes from './prototype';

const getPrototypesMenu = () => {
  return (
    <div className="prototypes-header">
      {
        Object.keys(prototypes)
          .map((componentName) => {
            return (
              <Link to={`/prototype/${componentName}`} key={componentName}>
                <button className="prototype-button">
                  {componentName}
                </button>
              </Link>
            );
          })
      }
    </div>
  );
}

const Prototype = (props) => {
  return (
    <div className={cx('Prototype', props.className)}>
      {getPrototypesMenu()}
      <Routes match={props.match} />
    </div>
  );
};

export default Prototype;
