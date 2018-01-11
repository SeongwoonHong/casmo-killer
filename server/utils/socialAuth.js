const axios = require('axios');

const socialAuthUtils = {

  facebook: (accessToken) => {
    return axios
      .get(`https://graph.facebook.com/v2.11/me?fields=id,name,email,picture&access_token=${accessToken}`)
      .then((response) => {
        return {
          strategy: 'facebook',
          email: response.data.email,
          displayName: response.data.name,
          avatar: response.data.picture.data.url,
          socialId: response.data.id.toString(),
          socialToken: accessToken
        };
      });
  },

  google: (accessToken) => {
    return axios
      .get('https://www.googleapis.com/plus/v1/people/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        return {
          strategy: 'google',
          email: response.data.emails[0].value,
          displayName: response.data.displayName,
          avatar: response.data.image.url,
          socialId: response.data.id.toString(),
          socialToken: accessToken
        };
      });
  },

  kakao: (accessToken) => {
    return axios
      .get('https://kapi.kakao.com/v1/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        return {
          strategy: 'kakao',
          email: response.data.kaccount_email,
          displayName: response.data.properties.nickname,
          avatar: response.data.properties.profile_image,
          socialId: response.data.id.toString(),
          socialToken: accessToken
        };
      });
  }

};

module.exports = socialAuthUtils;
