/* eslint-disable jsx-a11y/label-has-for, no-plusplus, max-len */
import React, { Component } from 'react';
import classnames from 'classnames';
import Materialize from 'materialize-css';
import animate from 'gsap-promise';
import TransitionGroup from 'react-transition-group-plus';
import SpanAnimatedText from '../SpanAnimatedText/SpanAnimatedText';
import inputValidator from '../../utils/input-validator';
import Button from '../Button/Button';

import './Register.scss';

const registerInputs = [
  {
    name: 'username', displayName: 'User Name', type: 'text', icon: 'account_circle'
  },
  {
    name: 'email', displayName: 'Email', type: 'email', icon: 'email'
  },
  {
    name: 'password', displayName: 'Password', type: 'password', icon: 'lock'
  },
  {
    name: 'confirmPassword', displayName: 'Confirm Password', type: 'password', icon: 'lock'
  }
];
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: {},
      validFields: {
        username: false,
        email: false,
        password: false,
        confirmPassword: false
      }
    };
  }
  componentDidMount = () => {
    animate.from(this.component, 1, { autoAlpha: 0, y: '-20%' });
  }
  onSubmitHandler = (e) => {
    this.setState({ errors: {} });
    const {
      username, email, password, confirmPassword
    } = this.state;
    e.preventDefault();
    let errors = {};
    registerInputs.map((input) => {
      return errors = this.fieldValidation(input.name);
    });
    for (let i = 0; i < registerInputs.length; i++) {
      errors[registerInputs[i].name] = this.fieldValidation(registerInputs[i].name)[registerInputs[i].name];
    }
    if (!errors.username && !errors.email && !errors.password && !errors.confirmPassword) {
      this.setState({ isLoading: true });
      // bcrypt 설치하면 터미널 에러뜨는데 해결방법 모르겠음...ㅠㅠ
      // const hashedPassword = bcrypt.hash(password, 10, (err, hash) => {
      //   return hash;
      // });
      // console.log(hashedPassword);
      this.props.registerRequest(username, email, password, confirmPassword);
      Materialize.toast($('<span style="color: #00c853">Register Success</span>'), 3000, 'rounded');
    } else {
      this.setState({ errors });
      Materialize.toast($('<span style="color: #FFB4BA">Register Failed</span>'), 3000, 'rounded');
    }
  }
  onChangeHandler = async (e) => {
    e.persist();
    await this.setState({
      [e.target.name]: e.target.value
    });
    const errors = this.fieldValidation(e.target.name);
    if (errors[e.target.name]) {
      this.setState({
        errors: {
          ...this.state.errors,
          [e.target.name]: errors[e.target.name]
        },
        validFields: {
          ...this.state.validFields,
          [e.target.name]: false
        }
      });
    } else {
      this.setState({
        errors: {
          ...this.state.errors,
          [e.target.name]: ''
        },
        validFields: {
          ...this.state.validFields,
          [e.target.name]: true
        }
      });
    }
  }
  fieldValidation = (fieldName) => {
    const errors = {};
    switch (fieldName) {
      case 'username':
        if (inputValidator.isEmpty(this.state.username)) {
          errors.username = 'This field is required';
        } else if (!inputValidator.isUsername(this.state.username)) {
          errors.username = 'Invalid Username';
        }
        break;
      case 'email':
        if (inputValidator.isEmpty(this.state.email)) {
          errors.email = 'This field is required';
        } else if (!inputValidator.isEmail(this.state.email)) {
          errors.email = 'Invalid Email';
        }
        break;
      case 'password':
        if (inputValidator.isEmpty(this.state.password)) {
          errors.password = 'This field is required';
        } else if (!inputValidator.isPassword(this.state.password)) {
          errors.password = 'Invalid Password';
        }
        break;
      case 'confirmPassword':
        if (inputValidator.isEmpty(this.state.confirmPassword)) {
          errors.confirmPassword = 'This field is required';
        } else if (this.state.password !== this.state.confirmPassword) {
          errors.password = 'Password should match';
          errors.confirmPassword = 'Password should match';
        }
        break;
      default:
        break;
    }
    return errors;
  }
  cancelHandler = () => {
    alert('CASMO KILLER!');
  }
  render() {
    return (
      <div className="container" id="register" ref={el => this.component = el}>
        <form className="col s12 l8">
          <div className="register-header">
            <div className="center register-header-text">
              <SpanAnimatedText text="NEW ACCOUNT" animateAtDidMount />
              <i
                className="material-icons prefix right register-close"
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
                onClick={this.cancelHandler}>
                cancel
              </i>
            </div>
          </div>
          <div className="register-body">
            {
              registerInputs.map((input, i) => {
                return (
                  <div className="row" key={input.name}>
                    <div className="input-field col s12 ">
                      <i className={classnames('material-icons prefix', { 'is-correct': this.state.validFields[input.name] })}>{ input.icon }</i>
                      <input
                        id={input.name}
                        type={input.type}
                        className="validate"
                        value={this.state[input.name]}
                        onChange={this.onChangeHandler}
                        name={input.name}
                      />
                      <label htmlFor={input.name}>{input.displayName}</label>
                      <TransitionGroup>
                        {
                          this.state.errors[input.name]
                          ? <SpanAnimatedText className="input-field-error-text" text={this.state.errors[input.name]} />
                          : null
                        }
                      </TransitionGroup>
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div className="register-footer">
            <Button
              to="#"
              className="btn waves-effect teal waves-light register-btn"
              type="submit"
              text="REGISTER"
              disabled={this.state.isLoading}
              onClick={this.onSubmitHandler}
              animateAtDidMount
            />
            {
              this.state.isLoading
              ?
                <div className="progress">
                  <div className="indeterminate" />
                </div>
              : null
            }
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
