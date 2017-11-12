/* eslint-disable no-plusplus, max-len, consistent-return */
import React, { Component } from 'react';
import Materialize from 'materialize-css';
import classnames from 'classnames';
import animate from 'gsap-promise';
import inputValidator from '../../utils/input-validator';
import Button from '../Button/Button';
import './Register.scss';

const registerInputs = [
  {
    name: 'username', displayName: 'User Name', type: 'text', validationFunc: 'isUsername'
  },
  {
    name: 'email', displayName: 'Email', type: 'email', validationFunc: 'isEmail'
  },
  {
    name: 'password', displayName: 'Password', type: 'password', validationFunc: 'isPassword'
  },
  {
    name: 'confirmPassword', displayName: 'Confirm Password', type: 'password', validationFunc: 'isPassword'
  }
];
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedInput: undefined,
      isLoading: false,
      username: {
        value: '',
        isTextVisible: true,
        error: ''
      },
      email: {
        value: '',
        isTextVisible: true,
        error: ''
      },
      password: {
        value: '',
        isTextVisible: true,
        error: ''
      },
      confirmPassword: {
        value: '',
        isTextVisible: true,
        error: ''
      }
    };
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-20%' });
    this.animateIn();
  }
  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: {
        ...this.state[e.target.name],
        value: e.target.value,
        isTextVisible: true
      }
    });
  }
  onFocusHandler = (e) => {
    this.setState({
      focusedInput: e.target.name
    });
  }
  onBlurHandler = (e) => {
    this.setState({ focusedInput: undefined });
    if (this.state[e.target.name].value) {
      this.setState({
        [e.target.name]: {
          ...this.state[e.target.name],
          value: e.target.value,
          isTextVisible: false
        }
      });
    }
  }
  onSubmitHandler = (e) => {
    this.clearStateErrors();
    e.preventDefault();
    Materialize.Toast.removeAll();
    const {
      username,
      email,
      password,
      confirmPassword
    } = this.state;
    this.validationErrorMessages = this.validateInputs(registerInputs);
    if (this.isInputValidationPassed(this.validationErrorMessages)) {
      this.setState({ isLoading: true });
      this.props.registerRequest(username.value, email.value, password.value, confirmPassword.value);
      setTimeout(() => {
        this.setState({ isLoading: false });
        Materialize.toast($('<span style="color: #00c853">Register Success!</span>'), 3000, 'rounded');
        this.props.history.push('/test/login');
      }, 2000);
    } else {
      Object.keys(this.validationErrorMessages).map((item) => {
        if (this.validationErrorMessages[item]) {
          this.setState({
            [item]: {
              ...this.state[item],
              error: this.validationErrorMessages[item]
            }
          });
          Materialize.toast($(`<span style="color: #FFB4BA">${this.validationErrorMessages[item]}</span>`), 5000, 'rounded');
        }
        return item;
      });
    }
  }
  clearStateErrors = () => {
    registerInputs.map((input) => {
      return this.setState({
        [input.name]: {
          ...this.state[input.name],
          error: ''
        }
      });
    });
  }
  animateIn = () => {
    return animate.to(this.component, 0.5, { autoAlpha: 1, y: '0%' });
  }
  validateInputs = (inputs) => {
    const errorMessages = {};
    let i;
    for (i = 0; i < inputs.length; i++) {
      if (inputValidator.isEmpty(this.state[inputs[i].name].value) && [inputs[i].name] !== 'passwordConfirm') {
        errorMessages[inputs[i].name] = `${inputs[i].displayName} is required`;
      } else if (!inputValidator[inputs[i].validationFunc](this.state[inputs[i].name].value)) {
        errorMessages[inputs[i].name] = `Invalid ${inputs[i].displayName}`;
      } else if (this.state.password.value !== this.state.confirmPassword.value) {
        errorMessages[inputs[3].name] = 'Password should match';
      }
    }
    return errorMessages;
  }
  isInputValidationPassed = (errors) => {
    return Object.keys(errors).length === 0;
  }
  render() {
    return (
      <div className="row container" id="register" ref={el => this.component = el}>
        <form className="col s12">
          <div>
            <div className="register-header card-panel teal lighten-2">
              New Account
            </div>
            <div className="register-body card-panel">
              {
                registerInputs.map((input) => {
                  return (
                    <div className="input-field" key={input.name}>
                      <input
                        type={input.type}
                        id={input.name}
                        name={input.name}
                        onChange={this.onChangeHandler}
                        onFocus={this.onFocusHandler}
                        className={classnames({ 'has-error': this.state[input.name].error })}
                        onBlur={this.onBlurHandler}
                        value={`${this.state[input.name].value}`}
                      />
                      {
                        this.state[input.name].isTextVisible
                        ?
                          <span
                            className={classnames('input-field-text', { isFocused: this.state.focusedInput === input.name })}
                          >
                            {input.displayName}
                          </span>
                        : null
                      }
                    </div>
                  );
                })
              }
            </div>
            <div className="register-footer card-panel">
              <div className="register-footer-btns">
                <Button
                  className="btn waves-effect teal waves-light register-btn"
                  type="submit"
                  name="action"
                  text="CREATE"
                  to="#"
                  onClick={this.onSubmitHandler}
                />
              </div>
              {
                this.state.isLoading
                ?
                  <div className="progress">
                    <div className="indeterminate" />
                  </div>
                : null
              }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
