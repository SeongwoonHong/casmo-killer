const getScriptId = (provider) => {
  switch (provider) {
    case 'google':
      return 'google-login';
    case 'facebook':
      return 'facebook-jssdk';
    case 'kakao':
      return 'kakao-sdk';
    default:
      return '';
  }
};

const getScriptUrl = (provider) => {
  switch (provider) {
    case 'google':
      return '//apis.google.com/js/client:platform.js';
    case 'facebook':
      return 'https://connect.facebook.net/en_US/sdk.js';
    case 'kakao':
      return '//developers.kakao.com/sdk/js/kakao.min.js';
    default:
      return '';
  }
};

export const loadSDK = (provider) => {
  return new Promise((resolve) => {
    const id = getScriptId(provider);

    if (document.getElementById(id)) {
      return resolve(false);
    }

    const element = document.getElementsByTagName('script')[0];
    const fjs = element;
    let js = element;

    js = document.createElement('script');
    js.id = id;
    js.src = getScriptUrl(provider);
    if (fjs) {
      fjs.parentNode && fjs.parentNode.insertBefore(js, fjs);
    }
    js.onload = () => resolve(true);
  });
};
