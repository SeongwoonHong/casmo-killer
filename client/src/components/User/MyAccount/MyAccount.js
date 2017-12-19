import React, { Component } from 'react';
import PlainBtn from 'sharedComponents/PlainBtn';

import './MyAccount.scss';

class MyAccount extends Component {

  constructor(props) {

    super(props);

    this.state = {
      password: {
        isEditing: false,
        hasBeenVerified: false
      }
    };

  }

  onSubmitHandler = (e) => {

    e.preventDefault();

  };

  securitySubmitHandler = (e) => {

    e.preventDefault();

    if (!this.state.password.isEditing) {
      this.setState({
        password: {
          ...this.state.password,
          isEditing: true
        }
      });
    }

  };

  render() {
    return (
      <div className="account-settings">
        <form
          noValidate
          onSubmit={ this.onSubmitHandler }
          className="account-settings-form">
          <div className="card">
            <div className="settings-header">
              <h4>Profile Settings</h4>
              <span>Update your email address, username, and profile picture.</span>
            </div>
            <div className="settings-fields">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" />
              <p>This email is linked to your account.</p>
            </div>
            <div className="settings-fields">
              <label htmlFor="username">Display Name</label>
              <input type="text" id="username" />
              <p>This is the display name for your account.</p>
            </div>
            <div className="settings-fields last-field">
              <label>Profile Picture</label>
              <div className="uploader">
                <img
                  className="circle"
                  src={ this.props.user.avatar }
                  alt={ this.props.user.username }
                />
                <input type="file" id="profilePicture" />
                <label htmlFor="profilePicture">
                  <span>Upload</span>
                  <span>Max 10mb GIF, JPG, or PNG</span>
                </label>
              </div>
            </div>
            <button type="submit">
              Save Changes
            </button>
          </div>
        </form>
        <form
          noValidate
          onSubmit={ this.securitySubmitHandler }
          className="account-settings-form">
          <div className="card">
            <div className="settings-header">
              <h4>Security Settings</h4>
              <span>Change your password, or delete your account</span>
            </div>
            {
              this.state.password.isEditing
                ? (
                  <div className="settings-fields">
                    <label htmlFor="password">Confirm your password</label>
                    <input type="text" id="password" />
                    <p>Please enter your current password to proceed.</p>
                    <PlainBtn>Submit</PlainBtn>
                  </div>
                )
                : null
            }
            <div className="button-group">
              <button type="submit">
                Change Password
              </button>
              <button type="submit">
                Delete Account
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default MyAccount;
