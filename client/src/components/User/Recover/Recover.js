import React, { Component } from 'react';

import './Recover.scss';

class Recover extends Component {

  constructor(props) {

    super(props);

    this.state = {
      isLoading: false,
      email: ''
    };

  }

  onChangeHandler = (e) => {};

  render() {

    return (
      <div className="Recover">
        <h2 className="user-page-title">
          Forgot your password
        </h2>
        <div className="user-form-box">
          <div className="user-form-header">
            <h3>Please enter your email</h3>
          </div>
          <form noValidate>
            <div className="user-form-fields">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                disabled={ this.state.isLoading }
                onChange={ this.onChangeHandler }
                value={ this.state.email } />
              <p>Verification email will be sent to this email.</p>
            </div>
            <button
              type="submit"
              className="user-form-button"
              disabled={ this.state.isLoading }>
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

}

export default Recover;
