import React, { Component } from 'react';

import * as storageUtils from 'sharedUtils/storageUtils';
import ModalContainer from 'sharedComponents/ModalContainer';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import SocialAuth from './SocialAuth/SocialAuth';
import LocalAuth from './LocalAuth/LocalAuth';

import './AuthModal.scss';

class AuthModal extends Component {

  onSocialRegister = (userInfo) => {
    console.log(userInfo);
    this.props.setUserForRegister(userInfo);
    this.props.history.push('/user/register');
  };

  onLoginSuccess = async (userInfo) => {
    const user = await storageUtils.set('ckUser', userInfo);
    this.props.loginSuccess(user);
  };

  render() {
    const {
      auth, closeAuthModal, startAuthProcess
    } = this.props;

    const processingOverlay = (isLoading) => {
      if (isLoading) {
        return (
          <div className="process-overlay">
            <LoadingCircle color="#004D40" />
          </div>
        );
      }
      return null;
    };

    if (auth.isOpen) {
      return (
        <ModalContainer
          onClose={ closeAuthModal }>
          <div className="auth-modal-body">
            { processingOverlay(auth.isLoading) }
            <SocialAuth
              startAuthProcess={ startAuthProcess }
              onRegister={ this.onSocialRegister }
              onSuccess={ this.onLoginSuccess } />
            <LocalAuth onSuccess={ this.onLoginSuccess } />
          </div>
        </ModalContainer>
      );
    }
    return null;
  }

}

export default AuthModal;
