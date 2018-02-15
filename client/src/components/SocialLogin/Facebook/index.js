import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadSdk } from '@sharedUtils/socialAuth';
import LoadingCircle from '@sharedComponents/LoadingCircle';

class FacebookAuth extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isSdkLoaded: false,
      isProcessing: false
    };

  }

  componentDidMount() {

    this._isMounted = true;

    if (document.getElementById('facebook-jssdk')) {
      this.sdkLoaded();
      return;
    }

    this.loadSdkLibrary();

  }

  componentWillUnmount() {

    this._isMounted = false;

  }

  setStateIfMounted(state) {

    if (this._isMounted) {
      this.setState(state);
    }

  }

  loadSdkLibrary() {

    const { clientId, version } = this.props;

    window.fbAsyncInit = () => {

      window.FB.init({
        version: `v${version}`,
        appId: clientId,
      });

      this.setStateIfMounted({
        isSdkLoaded: true
      });

    };

    loadSdk('facebook');

  }

  sdkLoaded() {

    this.setState({
      isSdkLoaded: true
    });

  }

  responseApi = (authResponse) => {

    const {
      // language: locale,
      // fields,
      onSuccess
    } = this.props;

    onSuccess({
      provider: 'facebook',
      accessToken: authResponse.accessToken
    });

    // window.FB.api('/me', {
    //   locale,
    //   fields
    // }, (me) => {
    //   Object.assign(me, authResponse);
    // });

  };

  checkLoginState = (response) => {

    const { authResponse, status } = response;
    const { onFailure } = this.props;

    this.setStateIfMounted({
      isProcessing: false
    });

    if (authResponse) {

      this.responseApi(authResponse);
      return;

    }

    if (onFailure) {
      onFailure({ status });
    }

  };

  click = () => {

    const { isSdkLoaded, isProcessing } = this.state;
    const { isDisabled, scope } = this.props;

    if (!isSdkLoaded || isProcessing || isDisabled) {
      return;
    }

    this.setState({
      isProcessing: true
    });

    window.FB.login(this.checkLoginState, { scope });

  };

  render() {

    const { children } = this.props;

    return (
      <button
        type="button"
        disabled={ !this.state.isSdkLoaded }
        onClick={ this.click }>
        {
          this.state.isSdkLoaded
            ? children
            : <LoadingCircle color="#515151" />
        }
      </button>
    );
  }

}


FacebookAuth.propTypes = {
  clientId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func,
  scope: PropTypes.string,

  isDisabled: PropTypes.bool,
  version: PropTypes.string,
  children: PropTypes.node.isRequired,
};

FacebookAuth.defaultProps = {
  isDisabled: false,
  scope: 'public_profile,email',
  version: '2.9',
  onFailure: error => console.log(error)
};

export default FacebookAuth;
