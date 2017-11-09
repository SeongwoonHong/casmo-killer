import React from 'react';

import './SearchForm.scss';

const SearchForm = ({ styleClass }) => {
  return (
    <form className={ `search-form ${styleClass}` }>
      <i className="material-icons">
        search
      </i>
      <input type="text" placeholder="Search" />
    </form>
  );
};

export default SearchForm;
