import React, { Component } from 'react';
// import Materialize from 'materialize-css';
// import classnames from 'classnames';
// import inputValidator from '../../utils/input-validator';
import Button from '../Button/Button';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordConfirm: ''
    };
  }
  render() {
    return (
      <div className="row container" id="register">
        <form className="col s12">
          <div>
            <div className="register-header card-panel cyan lighten-2">
              New Account
            </div>
            <div className="register-body card-panel">
              <p>
                <span>Display Name</span>
                <label htmlFor="displayName">
                  <input
                    type="text"
                    placeholder="displayName"
                    id="displayName"
                    name="displayName"
                    onChange={this.onChangeHandler}
                    value={this.state.email}
                  />
                </label>
              </p>
              <p>
                <span>Email</span>
                <label htmlFor="email">
                  <input
                    type="email"
                    placeholder="email"
                    id="email"
                    name="email"
                    onChange={this.onChangeHandler}
                    value={this.state.email}
                  />
                </label>
              </p>
              <p>
                <span>Password</span>
                <label htmlFor="password">
                  <input
                    type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                    onChange={this.onChangeHandler}
                    value={this.state.password}
                  />
                </label>
              </p>
              <p>
                <span>Password</span>
                <label htmlFor="passwordConfirm">
                  <input
                    type="password"
                    placeholder="password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    onChange={this.onChangeHandler}
                    value={this.state.passwordConfirm}
                  />
                </label>
              </p>
            </div>
            <div className="register-footer card-panel">
              <div className="register-footer-btns">
                <Button
                  className="btn waves-effect cyan waves-light login"
                  type="submit"
                  name="action"
                  disabled={this.state.isLoading}
                  text="CREATE"
                  onClick={this.onSubmitHandler}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
