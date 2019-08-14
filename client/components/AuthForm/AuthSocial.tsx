import React, { FunctionComponent } from 'react';
import { IAuthSocial } from 'interfaces';
import { Google, Facebook, Kakaotalk } from 'components';
import getConfig from 'next/config'

const {
  publicRuntimeConfig: {
    FACEBOOK_CLIENT_ID,
    GOOGLE_CLIENT_ID,
    KAKAOTALK_CLIENT_ID,
  },
} = getConfig()

const AuthSocial: FunctionComponent<IAuthSocial.IProps> = (props) => {
  const prefix = props.mode === 'login' ? 'Login' : 'Signup';

  function onSuccess(userInfo) {
    console.log(userInfo);
  }

  function onFailure(error) {
    console.log(error);
  }

  return (
    <div className="AuthSocial">
      <Google
        icon="/static/images/google-logo.png"
        id="gmail"
        clientId={GOOGLE_CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        className="gmail"
      >
        <span className="social-text">{prefix} with Google</span>
      </Google>
      <Facebook
        icon="/static/images/facebook-logo.png"
        id="facebook"
        clientId={FACEBOOK_CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        className="facebook"
      >
        <span className="social-text">{prefix} with Facebook</span>
      </Facebook>
      <Kakaotalk
        icon="/static/images/kakaotalk-logo.png"
        id="kakaotalk"
        clientId={KAKAOTALK_CLIENT_ID}
        onSuccess={onSuccess}
        onFailure={onFailure}
        className="kakaotalk"
      >
        <span className="social-text">{prefix} with Kakaotalk</span>
      </Kakaotalk>
    </div>
  );
};

export { AuthSocial };
