import React, { Component } from 'react';
import axios from 'axios';

import ModalContainer from 'sharedComponents/ModalContainer';
import LoadingCircle from 'sharedComponents/LoadingCircle';
import * as storageUtils from 'sharedUtils/storageUtils';

import SocialAuth from './SocialAuth';
import LocalAuth from './LocalAuth';
import Register from './Register';

import './AuthModal.scss';

class AuthModal extends Component {

  // this will take userInfo object and
  // redirect to register form
  onSocialRegister = (userInfo) => {
    this.props.setUserForRegister(userInfo);
  };

  // this is when login is successful
  onSuccess = async (userInfo) => {

    this.props.startAuthProcess();

    const user = await storageUtils.set('ckUser', userInfo);

    this.props.loginSuccess(user);

    const { user: currentUser } = this.props;

    if (currentUser.isLoggedIn) {
      this.props.closeAuthModal();
    }

  };

  render() {

    const {
      auth,
      closeAuthModal
    } = this.props;

    const processingOverlay = (isProcessing) => {

      if (isProcessing) {
        return (
          <div className="process-overlay">
            <LoadingCircle color="#004D40" />
          </div>
        );
      }

      return null;

    };

    if (auth.type !== null) {

      return (
        <ModalContainer
          onClose={ closeAuthModal }>
          <div className="auth-modal-body">
            { processingOverlay(auth.isProcessing) }
            {
              !auth.isRegistering
                ? ([
                  <SocialAuth
                    key={ 0 }
                    onRegister={ this.onSocialRegister }
                    onSuccess={ this.onSuccess } />,
                  <LocalAuth
                    key={ 1 }
                    onSuccess={ this.onSuccess } />
                ])
                : <Register onSuccess={ this.onSuccess } />
            }
          </div>
        </ModalContainer>
      );

    }

    return null;

  }

}

export default AuthModal;
