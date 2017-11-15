/* eslint-disable no-return-assign, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Materialize from 'materialize-css';
import classnames from 'classnames';
import animate from 'gsap-promise';
import { Link } from 'react-router-dom';
import './Login.scss';
import SpanAnimatedText from '../SpanAnimatedText/SpanAnimatedText';
import inputValidator from '../../utils/input-validator';
import Button from '../Button/Button';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false
    };
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-20%' });
    this.animateIn();
  }
  onSubmitHandler = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    this.validationErrorMessages = this.validateInputs(email, password);
    if (this.isInputValidationPassed(this.validationErrorMessages)) {
      this.setState({ isLoading: true });
      this.initializeState();
      this.props.loginRequest(email, password);
      setTimeout(() => { // temporay method for development purpose. will modify this later
        this.setState({ isLoading: false });
        Materialize.toast($('<span style="color: #00c853">Welcome brother!</span>'), 3000, 'rounded');
        Materialize.toast($(`<span style="color: #00c853">your email is ${this.props.auth.currentUser}</span>`), 3000, 'rounded');
        this.props.history.push('/');
      }, 2000);
    } else {
      let errorMsg = '';
      if (this.validationErrorMessages.email) {
        errorMsg = this.validationErrorMessages.email;
      }
      if (this.validationErrorMessages.password) {
        errorMsg += ` ${this.validationErrorMessages.password}`;
      }
      Materialize.toast($(`<span style="color: #FFB4BA">${errorMsg}</span>`), 4000, 'rounded');
    }
  }
  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  animateIn = () => {
    return animate.all([
      animate.to(this.component, 1, { autoAlpha: 1 }),
      animate.to(this.component, 0.5, { y: '0%' })
    ]);
  }
  validateInputs = (email, password) => {
    const errorMessages = {};
    if (inputValidator.isEmpty(email)) {
      errorMessages.email = 'Email is required.';
    } else if (!inputValidator.isEmail(email)) {
      errorMessages.email = 'Invalid Email.';
    }
    if (inputValidator.isEmpty(password)) {
      errorMessages.password = 'Password is required.';
    }
    return errorMessages;
  }
  initializeState = () => {
    this.setState({ email: '', password: '' });
  }
  isInputValidationPassed = (errors) => {
    return Object.keys(errors).length === 0;
  }
  render() {
    const loginSocialMedia = (
      <div className="login-social-media card-panel">
        <SpanAnimatedText text="Connect with" animateAtDidMount />
        <div className="social-media-btns">
          <div className="btn facebook" />
          <div className="btn kakaotalk" />
          <div className="btn google" />
        </div>
      </div>
    );
    const loginBody = (
      <div className="login-body">
        <div className="input-field col s12">
          <i className="material-icons prefix">email</i>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={this.onChangeHandler}
            value={this.state.email}
          />
        </div>
        <div className="input-field col s12">
          <i className="material-icons prefix">lock</i>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={this.onChangeHandler}
            value={this.state.password}
          />
        </div>
      </div>
    );
    const loginFooter = (
      <div className="login-footer">
        <div className="login-footer-btns">
          <Button
            className="btn waves-effect teal waves-light login"
            type="submit"
            name="action"
            disabled={this.state.isLoading}
            text="LOGIN"
            onClick={this.onSubmitHandler}
            style={{ display: 'inline-block', width: '40%' }}
          />
          <Button
            className="btn waves-effect teal waves-light register"
            name="action"
            to="/register"
            disabled={this.state.isLoading}
            text="REGISTER"
            style={{ display: 'inline-block', width: '40%' }}
          />
        </div>
        <p className="forgot-your-password"><Link to="/#">forgot your password?</Link></p>
        {
          this.state.isLoading
          ?
            <div className="progress">
              <div className="indeterminate" />
            </div>
          : null
        }
      </div>
    );
    return (
      <div ref={el => this.component = el} className={classnames('container', this.props.className)} id="login">
        <form className="col s12">
          <div className="card-panel">
            {loginSocialMedia}
            {loginBody}
            {loginFooter}
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
