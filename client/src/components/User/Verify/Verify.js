import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

import * as actions from 'actions';
import LoadingOverlay from 'sharedComponents/LoadingOverlay';
import ErrorPage from 'sharedComponents/ErrorPage';

import './Verify.scss';

class UserVerify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }

  async componentDidMount() {
    const { token } = this.props.match.params;
    this.verifyToken(token);
  }

  verifyToken = async (token) => {
    try {
      const { data } = await axios.get(`/api/auth/verify/token/${token}`);
      this.props.setUserForRegistration({ strategy: 'local', email: data.email });
      this.props.history.push('/user/register');
    } catch (error) {
      this.setState({ message: error.response.data.message });
    }
  };

  render() {
    if (this.state.message) {
      return (
        <ErrorPage
          title={ this.state.message }
          message="Please submit your email in the register form." />
      );
    }
    return (
      <LoadingOverlay
        isVisible="true"
        overlayColor="rgba(0,0,0,.75)"
        circleColor="#fff" />
    );
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserForRegistration: payload => dispatch(actions.setUserForRegistration(payload))
  };
};

export default connect(null, mapDispatchToProps)(UserVerify);
