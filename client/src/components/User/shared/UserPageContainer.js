import React from 'react';

import LoadingOverlay from 'sharedComponents/LoadingOverlay';

const UserPageContainer = (props) => {
  return (
    <div className={ props.className }>
      {
        props.title
          ? (
            <h2 className="user-page-title">
              { props.title }
              <i className="material-icons">
                { props.icon }
              </i>
            </h2>
          )
          : null
      }
      <div className="user-form-box">
        <LoadingOverlay
          isVisible={ props.isLoading }
          isComplete={ props.isComplete }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>{ props.formTitle }</h3>
          {
            props.formMsg
             ? <p>{ props.formMsg }</p>
             : null
          }
        </div>
        <form
          noValidate
          className="user-form"
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
                  className="user-form-button"
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

export default UserPageContainer;
