import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

import * as actions from 'actions';
import LoadingCircle from 'sharedComponents/LoadingCircle';

import './Verify.scss';

class UserVerify extends Component {

  componentDidMount() {
    console.dir(this.props);
    const { token } = this.props.match.params;
    axios
      .get(`/api/user/verify/email/${token}`)
      .then((res) => {
        setTimeout(() => {
          this.props.history.push('/');
          this.props.setUserForRegister({ email: res.data });
          this.props.openAuthModal('register');
        }, 2000);
      });
  }

  render() {
    return (
      <div className="verify-loader">
        <LoadingCircle color="#fff" />
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openAuthModal: authType => dispatch(actions.openAuthModal(authType)),
    setUserForRegister: payload => dispatch(actions.setUserForRegister(payload))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserVerify));
