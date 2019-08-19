import React, { useState, useEffect, FunctionComponent } from 'react';
import cx from 'classnames';
import { loadSDK } from 'utils';
import { ISocial } from 'interfaces';

const Kakaotalk:FunctionComponent<ISocial.IProps> = (props) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById('kakao-sdk')) {
      return setIsSDKLoaded(true);
    }

    loadSDKLibrary();
  }, []);

  async function loadSDKLibrary() {
    const { clientId } = props;

    const shouldInit = await loadSDK('kakao');

    if (shouldInit) {
      await (window as any).Kakao.init(clientId);
    }

    setIsSDKLoaded(true);
  }

  function click() {
    const { onSuccess, onFailure } = props;

    if (isSDKLoaded) {
      (window as any).Kakao.Auth.login({
        throughTalk: false,
        success: (response) => {
          onSuccess({
            provider: 'kakao',
            accessToken: response.access_token
          });
        },
        fail: onFailure
      });
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

export { Kakaotalk };
