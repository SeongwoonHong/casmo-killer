import React, { useState, useEffect, FunctionComponent } from 'react';
import cx from 'classnames';
import { loadSDK } from 'utils';
import { ISocial } from 'interfaces';

const Facebook: FunctionComponent<ISocial.IProps> = (props) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      return setIsSDKLoaded(true);
    }

    loadSDKLibrary();
  }, []);

  async function loadSDKLibrary() {
    const { clientId } = props;
    (window as any).fbAsyncInit = async () => {
      await (window as any).FB.init({
        version: `v2.9`,
        appId: clientId,
      });
    };

    await loadSDK('facebook');
    setIsSDKLoaded(true);
  }

  async function click() {
    const { onSuccess, onFailure } = props;

    if (isSDKLoaded) {
      try {
        (window as any).FB.login((response) => {
          const { authResponse, status } = response;

          if (authResponse) {
            return onSuccess({
              provider: 'facebook',
              accessToken: authResponse.accessToken,
            })
          }

          if (onFailure) {
            onFailure({ status });
          }
        }, { scope: 'public_profile,email' });
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
      id={props.id}
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

export { Facebook };
