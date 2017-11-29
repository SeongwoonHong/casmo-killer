import React, { Component } from 'react';
import animate from 'gsap-promise';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classname from 'classnames';
import './Login.scss';
import SpanAnimatedText from '../SpanAnimatedText/SpanAnimatedText';
import inputValidator from '../../utils/input-validator';

class Login extends Component {

  constructor(props) {

    super(props);

    this.state = {
      email: {
        isValid: false,
        touched: false,
        message: '',
        value: 'ckboardtoronto@gmail.com'
      },
      password: {
        isValid: false,
        touched: false,
        message: '',
        value: 'CkboardDD'
      },
      isLoading: false,
      status: {
        isSuccess: undefined,
        message: ''
      }
    };

    this.closeLoginModal = this.closeLoginModal.bind(this);

  }

  componentDidMount() {

    animate.set(this.component, {
      autoAlpha: 0,
      y: '-20%'
    });

    this.animateIn();

    document.addEventListener('keydown', this.closeLoginModal, false);

  }

  componentWillUnmount() {

    document.removeEventListener('keydown', this.closeLoginModal, false);

  }

  onSubmitHandler = (e) => {

    e.preventDefault();

    this.setState({
      isLoading: true,
      status: Object.assign({}, this.state.status, {
        message: 'Loggin In......'
      })
    });

    const payload = {
      email: this.state.email.value,
      password: this.state.password.value
    };

    axios
      .post('/api/user/signin/local', payload)
      .then((res) => {

        setTimeout(() => {

          this.props.loginSuccess(res.data.token);

          this.setState({
            isLoading: false,
            status: {
              isSuccess: true,
              message: `Welcome back, ${this.props.user.username} !`
            }
          });

          setTimeout(() => {
            this.props.toggleLoginModal();
          }, 2000);

        }, 1000);

      })
      .catch((error) => {
        console.log(error.response.data.error);

        setTimeout(() => {
          this.setState({
            isLoading: false,
            status: {
              isSuccess: false,
              message: error.response.data.error
            }
          });
        }, 1000);
      });

  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: Object.assign({}, this.state[e.target.name], {
        value: e.target.value
      })
    });
  };

  onBlurHandler = (e) => {

    const { value } = this.state[e.target.name];
    let isValid;

    if (e.target.name === 'email') {

      isValid = value.length > 0 && inputValidator.isEmail(value);

    } else if (e.target.name === 'password') {

      isValid = value.length > 0 && inputValidator.isPassword(value);

    }

    this.setState({
      [e.target.name]: Object.assign({}, this.state[e.target.name], {
        isValid,
        touched: true,
        message: isValid ? '' : `Please enter a valid ${e.target.name} value.`
      })
    });

  };

  resetTheForm = () => {
    //
  };

  animateIn = () => {
    return animate.all([
      animate.to(this.component, 1, { autoAlpha: 1 }),
      animate.to(this.component, 0.5, { y: '0%' })
    ]);
  };

  closeLoginModal(e) {

    if (e.keyCode === 27) {
      this.props.toggleLoginModal();
    }

  }

  render() {

    const socialLogin = (
      <div className="login-social">
        <SpanAnimatedText text="Connect with" animateAtDidMount />
        <div className="social-media-btns">
          <a className="facebook" href="/api/user/signup/facebook">
            <img src="/social-icons/facebook.png" alt="facebook-login" />
            <span className="center-align">Facebook</span>
          </a>
          <a className="kakao" href="/api/user/signup/kakao">
            <img src="/social-icons/kakao.png" alt="kakao-login" />
            <span className="center-align">Kakao</span>
          </a>
          <a className="google" href="/api/user/signup/google">
            <img src="/social-icons/google.png" alt="google-login" />
            <span className="center-align">Google</span>
          </a>
        </div>
      </div>
    );

    const localLogin = (
      <div className="login-local">
        <SpanAnimatedText text="Login with Email" animateAtDidMount />
        <div className={ classname('input-field', {
          valid: this.state.email.touched && this.state.email.isValid,
          invalid: this.state.email.touched && !this.state.email.isValid
        }) }>
          <i className="material-icons prefix">email</i>
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={ this.onChangeHandler }
            onBlur={ this.onBlurHandler }
            value={ this.state.email.value } />
          <span>
            {
              this.state.email.isValid
                ? 'Good!'
                : this.state.email.message
            }
          </span>
        </div>
        <div className={ classname('input-field', {
          valid: this.state.password.touched && this.state.password.isValid,
          invalid: this.state.password.touched && !this.state.password.isValid
        }) }>
          <i className="material-icons prefix">lock</i>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={ this.onChangeHandler }
            onBlur={ this.onBlurHandler }
            value={ this.state.password.value } />
          <span>
            {
              this.state.password.isValid
                ? 'Good!'
                : this.state.password.message
            }
          </span>
        </div>
        <button
          type="submit"
          className="btn teal darken-4 hide-in-dt"
          onClick={ this.onSubmitHandler }
          disabled={
            !this.state.email.isValid ||
            !this.state.password.isValid ||
            this.state.isLoading
          }>
          Log In
        </button>
        <div className="other-options">
          <Link
            to="/user/register"
            className="teal-text text-darken-2">
            Sign Up For Free
          </Link>
          <Link
            to="/#"
            className="teal-text text-darken-2">
            Forgot Your Password?
          </Link>
        </div>
      </div>
    );

    const loginStatus = () => {

      let statusIcon = null;

      if (this.state.status.isSuccess === undefined) {
        statusIcon = (
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-green-only">
              <div className="circle-clipper left">
                <div className="circle" />
              </div>
              <div className="gap-patch">
                <div className="circle" />
              </div>
              <div className="circle-clipper right">
                <div className="circle" />
              </div>
            </div>
          </div>
        );
      } else if (this.state.status.isSuccess === true && this.state.status.message.length > 0) {
        statusIcon = (
          <i className="material-icons">sentiment_very_satisfied</i>
        );
      } else if (this.state.status.isSuccess === false && this.state.status.message.length > 0) {
        statusIcon = (
          <i className="material-icons">sentiment_very_dissatisfied</i>
        );
      }

      return (
        <div className={ classname('authentication-message', {
          success: this.state.status.isSuccess === true,
          failed: this.state.status.isSuccess === false
        })}>
          { statusIcon }
          <p>{ this.state.status.message }</p>
          {
            !this.state.isLoading && !this.state.status.isSuccess
              ? (
                <button
                  className="btn teal darken-4"
                  onClick={ this.resetTheForm }>
                  Go Back
                </button>
              )
              : null
          }
        </div>
      );
    };

    return (
      <div
        ref={ el => this.component = el }
        className="login-wrapper"
        onClick={ (e) => {
          if (e.target.classList.contains('login-wrapper')) {
            this.props.toggleLoginModal();
          }
        } }>
        {
          !this.state.isLoading && this.state.status.isSuccess === undefined
            ? (
              <form className="login-body">
                { socialLogin }
                { localLogin }
              </form>
            )
            : (
              <div className="login-body preloader">
                { loginStatus() }
              </div>
            )
        }
      </div>
    );
  }

}

export default Login;
