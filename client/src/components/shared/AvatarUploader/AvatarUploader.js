import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { validateImg } from '@sharedUtils/inputValidators';

import './AvatarUploader.scss';

class AvatarUploader extends Component {

  constructor(props) {

    super(props);

    this.onImageUpload = this.onImageUpload.bind(this);

  }

  onImageUpload(e) {

    const reader = new FileReader();
    const image = e.target.files[0];

    let message = '';

    reader.onloadend = () => {

      if (image.size > 5000000) {
        message = 'File is too big.';
      } else if (!validateImg(reader.result)) {
        message = 'File format is not supported.';
      }

      this.props.onChange({
        value: message.length === 0 ? reader.result : undefined,
        message
      });

    };

    reader.readAsDataURL(image);

  }

  render() {

    const { className, avatar } = this.props;

    return (
      <div className={ `Avatar-uploader ${className}`}>
        <label>Profile Picture</label>
        <div className="Avatar-uploader__preview">
          <div className="Avatar-uploader__wrapper">
            {
              avatar.value
                ? (
                  <img
                    className="Avatar-uploader__img"
                    alt="user-avatar"
                    src={ avatar.value } />
                )
                : <span>No Image</span>
            }
          </div>
          <input
            type="file"
            accept="image/*"
            id="profilePicture"
            className="Avatar-uploader__input"
            onChange={ this.onImageUpload } />
          <label
            htmlFor="profilePicture"
            className="Avatar-uploader__label">
            <span className="User__form__btn Avatar-uploader__btn">
              Upload New Picture
            </span>
            <span className="Avatar-uploader__text">
              Max 5mb, JPG, or PNG
            </span>
          </label>
        </div>
      </div>
    );
  }

}

AvatarUploader.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.any,
  onChange: PropTypes.func.isRequired
};

AvatarUploader.defaultProps = {
  className: '',
  avatar: {}
};

export default AvatarUploader;
