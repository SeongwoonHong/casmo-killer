import React, { useState, useEffect, FunctionComponent } from 'react';
import cx from 'classnames';
import { loadSDK } from 'utils';
import { ISocial } from 'interfaces';

const Google:FunctionComponent<ISocial.IProps> = (props) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('google-login')) {
      return setIsSDKLoaded(true);
    }

    loadSDKLibrary();
  }, []);

  async function loadSDKLibrary() {
    const {
      clientId,
      onFailure,
    } = props;

    const shouldInit = await loadSDK('google');

    if (shouldInit) {
      const params = {
        client_id: clientId,
        cookie_policy: 'none',
        scope: 'profile email',
      };

      (window as any).gapi.load('auth2', () => {
        if (!(window as any).gapi.auth2.getAuthInstance()) {
          (window as any).gapi.auth2
            .init(params)
            .then(() => {
              setIsSDKLoaded(true);
            })
            .catch((error) => {
              onFailure(error);
            });
        }
      });
    }
  }

  async function click() {
    const { onSuccess, onFailure } = props;

    if (isSDKLoaded) {
      try {
        const auth2 = (window as any).gapi.auth2.getAuthInstance();
        const response = await auth2.signIn();

        onSuccess({
          provider: 'google',
          accessToken: response.getAuthResponse().access_token
        });
      } catch (error) {
        onFailure(error);
      }
    }
  };

  return (
    <button
      type="button"
      className={cx('social', props.className)}
      onClick={click}
      disabled={!isSDKLoaded}
    >
      <img
        src={props.icon}
        className={`${props.id}-logo`}
      />
      {
        isSDKLoaded ? props.children : <div className="social-text">Loading..</div>
      }
    </button>
  );
};

export { Google };
