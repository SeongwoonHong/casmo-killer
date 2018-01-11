import React from 'react';

import './SearchForm.scss';

const SearchForm = ({ styleClass }) => {
  return (
    <form className={ `Search-form ${styleClass}` }>
      {
        styleClass === 'mb'
          ? (
            <button className="top-nav-btn">
              <i className="material-icons">
                search
              </i>
            </button>
          )
          : (
            <i className="material-icons">
              search
            </i>
          )
      }
      <input type="text" placeholder="Search" />
    </form>
  );
};

export default SearchForm;
