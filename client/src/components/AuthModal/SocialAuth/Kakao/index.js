import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadSdk } from 'sharedUtils/SocialAuth';
import PlainBtn from 'sharedComponents/PlainBtn';
import LoadingCircle from 'sharedComponents/LoadingCircle';

class KakaoAuth extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isSdkLoaded: false
    };

  }

  componentDidMount() {

    this.loadSdkLibrary();

  }

  async loadSdkLibrary() {

    const { clientId } = this.props;

    const shouldInit = await loadSdk('kakao');

    if (shouldInit) {
      window.Kakao.init(clientId);
    }

    this.setState({
      isSdkLoaded: true
    });

  }

  click = () => {

    const { onSuccess, onFailure } = this.props;

    window.Kakao.Auth.login({
      throughTalk: false,
      success: (response) => {
        onSuccess({
          provider: 'kakao',
          accessToken: response.access_token
        });
        // window.Kakao.API.request({
        //   url: '/v1/user/me',
        //   success: (profile) => {
        //     console.log(profile);
        //   },
        //   fail: onFailure
        // });
      },
      fail: onFailure
    });

  };

  render() {

    const { children } = this.props;

    return (
      <PlainBtn
        disabled={ !this.state.isSdkLoaded }
        onClick={ this.click }>
        {
          this.state.isSdkLoaded
            ? children
            : <LoadingCircle />
        }
      </PlainBtn>
    );

  }

}

KakaoAuth.propTypes = {
  clientId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func,
  children: PropTypes.node.isRequired
};

KakaoAuth.defaultProps = {
  onFailure: error => console.log(error)
};

export default KakaoAuth;
