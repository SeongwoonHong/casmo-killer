import React, { FunctionComponent } from 'react';
import { IAuthSocial } from 'interfaces';
import cx from 'classnames';

const socials = [
  {
    id: 'facebook',
    icon: 'facebook-logo.png',
    label: 'Facebook',
  },
  {
    id: 'gmail',
    icon: 'gmail-logo.png',
    label: 'Gmail',
  },
  {
    id: 'kakaotalk',
    icon: 'kakaotalk-logo.png',
    label: 'Kakao Talk',
  },
]

const AuthSocial: FunctionComponent<IAuthSocial.IProps> = props => {
  return (
    <div className="AuthSocial">
      {
        socials.map((social) => {
          return (
            <div
              className={cx('social', [social.id])}
              key={social.id}
            >
              <img
                src={`static/images/${social.icon}`}
                className={`${social.id}-logo`}
              />
              <span className="social-text">{social.label}</span>
            </div>
          );
        })
      }
    </div>
  );
};

export { AuthSocial };
