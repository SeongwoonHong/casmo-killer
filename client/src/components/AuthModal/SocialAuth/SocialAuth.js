import React, { Component } from 'react';
import axios from 'axios';

import SpanAnimatedText from 'sharedComponents/SpanAnimatedText';
import FormMessage from 'sharedComponents/FormMessage';

import FacebookAuth from './Facebook';
import GoogleAuth from './Google';
import KakaoAuth from './Kakao';

import './SocialAuth.scss';

class Social extends Component {

  constructor(props) {
    super(props);
    this.state = { message: '' };
  }

  onSuccess = async (payload) => {

    const {
      startAuthProcess, onRegister, onSuccess
    } = this.props;

    startAuthProcess();

    try {

      const { data } = await axios.post('/api/user/validate/social', payload);

      if (data.shouldRegister) {
        onRegister(Object.assign(data.profile, {
          social: payload
        }));
      } else {
        onSuccess(data.user);
      }


    } catch (error) {

      console.error(error.response.data.error);
      this.setState({
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

    const { message } = this.state;

    return (
      <div key={ 1 } className="social-auth">
        <SpanAnimatedText
          text="Connect with"
          animateAtDidMount
        />
        <FormMessage message={ message } />
        <div className="facebook">
          <FacebookAuth
            clientId={ facebookId }
            fields="name,email,picture"
            onSuccess={ this.onSuccess }>
            <img src="/social-icons/facebook.png" alt="facebook-login" />
            <span className="center-align">Facebook</span>
          </FacebookAuth>
        </div>
        <div className="google">
          <GoogleAuth
            clientId={ googleId }
            onSuccess={ this.onSuccess }>
            <img src="/social-icons/google.png" alt="google-login" />
            <span className="center-align">Google</span>
          </GoogleAuth>
        </div>
        <div className="kakao">
          <KakaoAuth
            clientId={ kakaoId }
            onSuccess={ this.onSuccess }>
            <img src="/social-icons/kakao.png" alt="kakao-login" />
            <span className="center-align">Kakao</span>
          </KakaoAuth>
        </div>
      </div>
    );
  }

}

export default Social;
