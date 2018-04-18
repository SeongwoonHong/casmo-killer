import React, { Component } from 'react';
import axios from 'axios';
import { Prompt } from 'react-router-dom';

import * as storage from '@sharedUtils/storage';
import {
  validateImg,
  validateDisplayName,
  validatePassword
} from '@sharedUtils/inputValidators';

import FormMessage from '@sharedComponents/FormMessage';

import UserPageContainer from '../../components/UserPageContainer';
import UserInputField from '../../components/UserInputField';

import './UserRegister.scss';

class Register extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isMounted: false,
      isLoading: false,
      displayName: {
        value: props.auth.displayName || '',
        message: ''
      },
      password: {
        value: '',
        message: ''
      },
      avatar: {
        value: props.auth.avatar || '',
        message: ''
      },
      errorMsg: ''
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onImageUpload = this.onImageUpload.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
    this.verifyToken = this.verifyToken.bind(this);

  }

  componentDidMount() {

    const {
      history, auth, match, setErrorState
    } = this.props;

    if (match.params.token) {

      this.verifyToken(match.params.token);

    } else if (!auth.email) {

      setErrorState({
        errorTitle: 'The registration link is invalid.',
        errorMsg: 'Please submit your email again to complete the registration.'
      });

      history.push('/error');

    }

  }

  onChangeHandler(e) {
    this.setState({
      [e.name]: {
        ...this.state[e.name],
        value: e.value
      }
    });
  }

  async onSubmitHandler() {

    const resetState = {};

    // remove any previous validation messages
    Object.keys(this.state).forEach((key) => {
      resetState[key] = this.state[key];
      if (Object.prototype.hasOwnProperty.call(this.state[key], 'message')) {
        resetState[key].message = '';
      }
    });

    // empty the messages and set the loading status to true
    this.setState(Object.assign({}, resetState, {
      isLoading: true
    }));

    const { displayName, password } = this.state;

    const errorMsg = {
      forDisplayName: '',
      forPassword: ''
    };

    // validate displayName and register validation messages
    // if there are any
    errorMsg.forDisplayName = await validateDisplayName(displayName.value);

    this.setState({
      displayName: {
        ...this.state.displayName,
        message: errorMsg.forDisplayName
      }
    });

    // validate the password only when it's local signup
    if (this.props.auth.strategy === 'local') {

      errorMsg.forPassword = await validatePassword(password.value);

      this.setState({
        password: {
          ...this.state.password,
          message: errorMsg.forPassword
        }
      });

    }

    if (
      errorMsg.forDisplayName.length === 0 &&
      errorMsg.forPassword.length === 0
    ) {
      this.submitRegister();
    } else {
      this.setState({ isLoading: false });
    }

  }

  // TODO: move image upload to its own component
  onImageUpload(e) {

    this.setState({ isLoading: true });

    const reader = new FileReader();
    const image = e.target.files[0];

    let message = '';

    reader.onloadend = () => {

      if (image.size > 5000000) {
        message = 'File is too big.';
      } else if (!validateImg(reader.result)) {
        message = 'File format is not supported.';
      }

      this.setState({
        avatar: {
          value: message.length > 0
            ? this.state.avatar.value
            : reader.result,
          message
        },
        isLoading: false
      });

    };

    reader.readAsDataURL(image);

  }

  async submitRegister() {

    const {
      strategy, email, socialId, socialToken
    } = this.props.auth;

    const {
      displayName, avatar, password
    } = this.state;

    const isLocal = strategy === 'local';

    const userData = new FormData();

    userData.append('strategy', strategy);
    userData.append('email', email);
    userData.append('displayName', displayName.value);

    if (avatar.value.length > 0) {
      userData.append('avatar', avatar.value);
    }

    if (isLocal) {
      userData.append('password', password.value);
    } else {
      userData.append('socialId', socialId);
      userData.append('socialToken', socialToken);
    }

    try {

      const apiUrl = `/api/auth/register/${isLocal ? 'local' : 'social'}`;
      const { data } = await axios.post(apiUrl, userData);

      if (data && data.user) {

        const user = await storage.set('ckUser', data.user);

        await this.props.loginSuccess(user, true);

        const { isLoggedIn } = this.props.user;

        if (isLoggedIn) {
          this.props.history.replace('/');
        }

      } else {

        this.setState({
          errorMsg: 'Failed to communicate with the server.'
        });

      }

    } catch (error) {

      console.error(error);
      console.error(error.response.data.error);
      this.setState({
        errorMsg: error.response && error.response.data.message
      });

    }

    this.setState({ isLoading: false });

  }

  async verifyToken(token) {

    const {
      history, setUserForRegistration, setErrorState
    } = this.props;

    try {

      const { data } = await axios.get(`/api/auth/verify/token/register/${token}`);

      if (data && data.email) {

        setUserForRegistration({
          strategy: 'local',
          email: data.email
        });

        history.replace('/user/register');

      } else {

        this.setState({
          errorMsg: 'Failed to communicate with the server.'
        });

      }

    } catch (error) {

      console.error(error);

      setErrorState({
        errorTitle: 'The registration link is invalid.',
        errorMsg: error.response && error.response.data.message
      });

      history.push('/error');

    }

    this.setState({ isMounted: true });

  }

  render() {

    const {
      isMounted,
      isLoading,
      displayName,
      password,
      avatar,
      errorMsg
    } = this.state;

    const { auth } = this.props;

    const avatarPreview = (avatarState) => {
      if (avatarState.value) {
        return (
          <img
            className="circle avatar-img"
            alt="user-avatar"
            src={ avatarState.value }
          />
        );
      }
      return <span>No Image</span>;
    };

    return (
      <UserPageContainer
        className="Register"
        title="User Registration"
        icon="person_add"
        isLoading={ isLoading }
        formTitle="User Information"
        formMsg="Please fill in the following fields to complete your registration."
        onSubmit={ this.onSubmitHandler }>

        <Prompt
          when={ isMounted && !isLoading }
          message="Are you fucking sure? Your information will be lost." />

        <FormMessage message={ errorMsg } />

        <UserInputField
          name="email"
          onChange={ this.onChangeHandler }
          value={ auth.email || '' }
          disabled={ !!auth.email } />

        <FormMessage message={ displayName.message } />
        <UserInputField
          name="displayName"
          onChange={ this.onChangeHandler }
          value={ displayName.value } />

        <FormMessage message={ password.message } />
        <UserInputField
          isVisible={ auth.strategy === 'local' }
          name="password"
          onChange={ this.onChangeHandler }
          value={ password.value } />

        <FormMessage message={ avatar.message } />
        <div className="user-form-fields">
          <label>Profile Picture</label>
          <div className="avatar-preview">
            <div className="avatar-wrapper">
              { avatarPreview(avatar) }
            </div>
            <input
              type="file"
              accept="image/*"
              id="profilePicture"
              onChange={ this.onImageUpload } />
            <label htmlFor="profilePicture">
              <span className="user-form-button">
                Upload New Picture
              </span>
              <span>Max 5mb, JPG, or PNG</span>
            </label>
          </div>
        </div>

      </UserPageContainer>
    );

  }

}

export default Register;
