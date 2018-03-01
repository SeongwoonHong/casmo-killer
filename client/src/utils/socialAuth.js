const scriptId = (provider) => {

  switch (provider) {

    case 'google':
      return 'google-login';

    case 'facebook':
      return 'facebook-jssdk';

    case 'kakao':
      return 'kakao-sdk';

    default:
      return null;

  }

};

const scriptUrl = (provider) => {

  switch (provider) {

    case 'google':
      return '//apis.google.com/js/client:platform.js';

    case 'facebook':
      return 'https://connect.facebook.net/en_US/sdk.js';

    case 'kakao':
      return '//developers.kakao.com/sdk/js/kakao.min.js';

    default:
      return null;

  }

};

export const loadSdk = (provider) => {

  return new Promise((resolve) => {

    const id = scriptId(provider);

    if (document.getElementById(id)) {

      resolve(false);

    } else {

      const element = document.getElementsByTagName('script')[0];
      const fjs = element;
      let js = element;

      js = document.createElement('script');
      js.id = id;
      js.src = scriptUrl(provider);
      if (fjs) {
        fjs.parentNode.insertBefore(js, fjs);
      }
      js.onload = () => resolve(true);

    }
  });

};

export const getAccessToken = (provider) => {
  console.log(provider);
};
