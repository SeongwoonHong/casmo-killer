import React from 'react';
import PropTypes from 'prop-types';

import LoadingOverlay from '@sharedComponents/LoadingOverlay';

import './UserPageContainer.scss';

const UserPageContainer = (props) => {

  return (
    <div className={ props.className }>
      {
        props.title
          ? (
            <h2 className="User__page__title">
              { props.title }
              <i className="User__page__title__icons material-icons">
                { props.icon }
              </i>
            </h2>
          )
          : null
      }
      <div className={ `User__form__row ${props.className}__form__row`}>
        <LoadingOverlay
          isVisible={ props.isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className={ `User__form__header ${props.className}__form__header`}>
          <h3 className={ `User__form__header__title ${props.className}__form__header__title`}>
            { props.formTitle }
          </h3>
          {
            props.formMsg
              ? (
                <p className={ `User__form__header__subtitle ${props.className}__form__header__subtitle` }>
                  { props.formMsg }
                </p>
              )
              : null
          }
        </div>
        <form
          noValidate
          className={ `User__form ${props.className}__form user-form` }
          onSubmit={ (e) => {
            e.preventDefault();
            props.onSubmit();
          } }>
          { props.children }
          {
            props.button
              ? props.button
              : (
                <button
                  type="submit"
                  className="User__form__btn user-form-button"
                  disabled={ props.disabled }>
                  Submit
                </button>
              )
          }
        </form>
      </div>
    </div>
  );

};

UserPageContainer.propTypes = {
  className: PropTypes.string.isRequired,
  title: PropTypes.string,
  icon: PropTypes.string,
  isLoading: PropTypes.bool,
  formTitle: PropTypes.string.isRequired,
  formMsg: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool
};

UserPageContainer.defaultProps = {
  title: '',
  icon: '',
  isLoading: false,
  formMsg: '',
  disabled: false
};

export default UserPageContainer;
