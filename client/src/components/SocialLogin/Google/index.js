import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadSdk } from '@sharedUtils/socialAuth';
import LoadingCircle from '@sharedComponents/LoadingCircle';

class GoogleAuth extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isSdkLoaded: false
    };

  }

  componentDidMount() {

    this._isMounted = true;
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

  async loadSdkLibrary() {

    const {
      clientId,
      scope,
      fetchBasicProfile,
      hostedDomain,
      uxMode,
      onFailure
    } = this.props;

    const shouldInit = await loadSdk('google');

    if (shouldInit) {

      const params = {
        client_id: clientId,
        cookie_policy: 'none',
        scope,
        fetch_basic_profile: fetchBasicProfile,
        hosted_domain: hostedDomain,
        ux_mode: uxMode
      };

      window.gapi.load('auth2', () => {

        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2
            .init(params)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              onFailure(error);
            });
        }

      });
    }

    this.setStateIfMounted({
      isSdkLoaded: true
    });

  }

  click = async () => {

    if (this.state.isSdkLoaded) {

      const { onSuccess, onFailure, prompt } = this.props;
      const auth2 = window.gapi.auth2.getAuthInstance();
      const options = {
        prompt
      };

      try {

        const response = await auth2.signIn(options);

        onSuccess({
          provider: 'google',
          accessToken: response.getAuthResponse().access_token
        });

      } catch (error) {

        onFailure(error);

      }

    }
  };

  render() {

    const { className, children } = this.props;

    return (
      <button
        type="button"
        className={ className }
        disabled={ !this.state.isSdkLoaded }
        onClick={ this.click }>
        {
          this.state.isSdkLoaded
            ? children
            : <LoadingCircle className={ `${className}__circle`} />
        }
      </button>
    );

  }

}

GoogleAuth.propTypes = {
  className: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func,

  scope: PropTypes.string,
  fetchBasicProfile: PropTypes.bool,
  hostedDomain: PropTypes.string,
  uxMode: PropTypes.string,

  prompt: PropTypes.string,
  children: PropTypes.node.isRequired
};

GoogleAuth.defaultProps = {
  scope: 'profile email',
  fetchBasicProfile: true,
  hostedDomain: '',
  uxMode: 'popup',
  prompt: 'select_account',
  onFailure: status => console.log(status)
};

export default GoogleAuth;
