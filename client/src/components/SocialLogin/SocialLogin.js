import React, { Component } from 'react';
import axios from 'axios';

import facebookImg from '@assets/facebook.png';
import googleImg from '@assets/google.png';
import kakaoImg from '@assets/kakao.png';

import FormMessage from '@sharedComponents/FormMessage';
import LoadingOverlay from '@sharedComponents/LoadingOverlay';

import './SocialLogin.scss';

import FacebookAuth from './Facebook';
import GoogleAuth from './Google';
import KakaoAuth from './Kakao';

class SocialLogin extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      message: ''
    };

  }

  onSuccess = async (payload) => {

    const { onRegister, onSuccess } = this.props;

    this.setState({
      isLoading: true,
      message: ''
    });

    try {

      const { data } = await axios.post('/api/auth/login/social', payload);

      if (data) {

        if (data.shouldRegister) {
          onRegister(data.profile);
        } else if (data.user) {
          onSuccess(data.user);
        }

      } else {

        this.setState({
          isLoading: false,
          message: 'Failed to communicate with the server.'
        });

      }

    } catch (error) {

      console.error(error.response.data.error);
      this.setState({
        isLoading: false,
        message: error.response.data.message
      });

    }

  };

  render() {

    const {
      REACT_APP_facebookClientId: facebookId,
      REACT_APP_googleClientId: googleId,
      REACT_APP_kakaoClientId: kakaoId
    } = process.env;

    const { isLogin } = this.props;

    const { isLoading, message } = this.state;

    return (
      <div className="Social-login user-form-box">
        <LoadingOverlay
          isVisible={ isLoading }
          overlayColor="rgba(256,256,256,.75)"
          circleColor="#1F4B40" />
        <div className="user-form-header">
          <h3>Social Login</h3>
          {
            isLogin
              ? null
              : <p>User your favourite social network to sign up.</p>
          }
        </div>
        <FormMessage message={ message } />
        <div className="social-btn-wrapper">
          <div className="facebook">
            <FacebookAuth
              clientId={ facebookId }
              fields="name,email,picture"
              onSuccess={ this.onSuccess }>
              <img src={ facebookImg } alt="facebook-login" />
              <span className="center-align">Facebook</span>
            </FacebookAuth>
          </div>
          <div className="google">
            <GoogleAuth
              clientId={ googleId }
              onSuccess={ this.onSuccess }>
              <img src={ googleImg } alt="google-login" />
              <span className="center-align">Google</span>
            </GoogleAuth>
          </div>
          <div className="kakao">
            <KakaoAuth
              clientId={ kakaoId }
              onSuccess={ this.onSuccess }>
              <img src={ kakaoImg } alt="kakao-login" />
              <span className="center-align">Kakao</span>
            </KakaoAuth>
          </div>
        </div>
      </div>
    );
  }

}

export default SocialLogin;
