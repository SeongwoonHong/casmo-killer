/* eslint-disable no-plusplus, max-len, consistent-return, no-lonely-if */
import React, { Component } from 'react';
import classnames from 'classnames';
import animate from 'gsap-promise';
import TransitionGroup from 'react-transition-group-plus';
import SpanAnimatedText from '../SpanAnimatedText/SpanAnimatedText';
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
        isValid: false
      },
      email: {
        value: '',
        isTextVisible: true,
        isValid: false
      },
      password: {
        value: '',
        isTextVisible: true,
        isValid: false
      },
      confirmPassword: {
        value: '',
        isTextVisible: true,
        isValid: false
      },
      formErrors: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      formValid: false
    };
  }
  componentDidMount = () => {
    animate.set(this.component, { autoAlpha: 0, y: '-20%' });
    this.animateIn();
  }
  onChangeHandler = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: {
        ...this.state[name],
        value
      }
    }, () => this.validateField(name, value));
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
    } else {
      this.setState({
        [e.target.name]: {
          ...this.state[e.target.name],
          value: e.target.value,
          isTextVisible: true
        }
      });
    }
  }
  onSubmitHandler = (e) => {
    const {
      username, email, password, confirmPassword
    } = this.state;
    e.preventDefault();
    registerInputs.map((input) => {
      return this.validateField(input.name, this.state[input.name].value);
    });
    if (this.isInputValidationPassed()) {
      this.setState({ isLoading: true });
      this.props.registerRequest(username.value, email.value, password.value, confirmPassword.value);
      setTimeout(() => {
        this.setState({ isLoading: false });
        Materialize.toast($('<span style="color: #00c853">Register Success!</span>'), 3000, 'rounded');
        this.props.history.push('/test/login');
      }, 2000);
    } else {
      if (this.state.formValid) {
        this.setState({ isLoading: true }, () => {
          setTimeout(() => {
            Materialize.toast($('<span style="color: #FFB4BA">Register Failed</span>'), 5000, 'rounded');
            this.setState({ isLoading: false });
          }, 1000);
        });
      }
    }
  }
  validateField = (fieldName, value) => {
    const { formErrors } = this.state;
    let usernameIsValid = this.state.username.isValid;
    let emailIsValid = this.state.email.isValid;
    let passwordIsValid = this.state.password.isValid;
    let confirmPasswordIsValid = this.state.confirmPassword.isValid;

    switch (fieldName) {
      case 'username':
        usernameIsValid = !inputValidator.isEmpty(value);
        if (!usernameIsValid) {
          formErrors.username = 'This field is required';
        } else {
          usernameIsValid = inputValidator.isUsername(value);
          if (usernameIsValid) {
            formErrors.username = '';
          } else {
            formErrors.username = 'User Name is invalid';
          }
        }
        break;
      case 'email':
        emailIsValid = !inputValidator.isEmpty(value);
        if (!emailIsValid) {
          formErrors.email = 'This field is required';
        } else {
          emailIsValid = inputValidator.isEmail(value);
          if (emailIsValid) {
            formErrors.email = '';
          } else {
            formErrors.email = 'Email is invalid';
          }
        }
        break;
      case 'password':
        passwordIsValid = !inputValidator.isEmpty(value);
        if (!passwordIsValid) {
          formErrors.password = 'This field is required';
          break;
        } else {
          passwordIsValid = inputValidator.isPassword(value);
          if (!passwordIsValid) {
            formErrors.password = 'Password is invalid';
          } else if (this.state.password.value !== this.state.confirmPassword.value) {
            formErrors.password = 'Password should match';
            formErrors.confirmPassword = 'Password should match';
          } else {
            formErrors.password = '';
            formErrors.confirmPassword = '';
          }
        }
        break;
      case 'confirmPassword':
        confirmPasswordIsValid = !inputValidator.isEmpty(value);
        if (!confirmPasswordIsValid) {
          formErrors.confirmPassword = 'This field is required';
          break;
        } else {
          confirmPasswordIsValid = inputValidator.isPassword(value);
          if (!confirmPasswordIsValid) {
            formErrors.confirmPassword = 'Confirm Password is invalid';
          } else if (this.state.password.value !== this.state.confirmPassword.value) {
            formErrors.password = 'Password should match';
            formErrors.confirmPassword = 'Password should match';
          } else {
            formErrors.password = '';
            formErrors.confirmPassword = '';
          }
        }
        break;
      default:
        break;
    }
    this.setState({
      ...this.state,
      formErrors,
      username: {
        ...this.state.username,
        isValid: usernameIsValid
      },
      email: {
        ...this.state.email,
        isValid: emailIsValid
      },
      password: {
        ...this.state.password,
        isValid: passwordIsValid
      },
      confirmPassword: {
        ...this.state.confirmPassword,
        isValid: confirmPasswordIsValid
      },
    }, () => this.validateForm());
  }
  validateForm = () => {
    this.setState({
      formValid: this.state.username.isValid && this.state.email.isValid && this.state.password.isValid && this.state.confirmPassword.isValid
    });
  }
  clearStateErrors = () => {
    this.setState({
      formErrors: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    });
  }
  animateIn = () => {
    return animate.to(this.component, 0.5, { autoAlpha: 1, y: '0%' });
  }
  isInputValidationPassed = () => {
    const { formErrors } = this.state;
    const {
      username,
      email,
      password,
      confirmPassword
    } = formErrors;
    if (this.state.formValid && username === '' && email === '' && password === '' && confirmPassword === '') {
      return true;
    }
    return false;
  }
  render() {
    return (
      <div className="row container" id="register" ref={el => this.component = el}>
        <form className="col s12">
          <div>
            <div className="register-header card-panel teal lighten-2">
              <SpanAnimatedText text="New Account" animateAtDidMount />
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
                        onBlur={this.onBlurHandler}
                        value={`${this.state[input.name].value}`}
                      />
                      <TransitionGroup>
                        {
                          this.state[input.name].isTextVisible
                          ?
                            <SpanAnimatedText
                              className={classnames('input-field-text', { isFocused: this.state.focusedInput === input.name })}
                              text={input.displayName}
                              animateAtDidMount
                            />
                            : null
                          }
                      </TransitionGroup>
                      <TransitionGroup>
                        {
                          this.state.formErrors[input.name] !== ''
                          ? <SpanAnimatedText className="input-error" text={this.state.formErrors[input.name]} />
                          : null
                        }
                      </TransitionGroup>
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
                  disabled={this.state.isLoading}
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
