const {
  socialAuth: _socialAuth,
} = jest.genMockFromModule('../social-auth');

_socialAuth.fetchSocialInfo = jest.fn((provider, token) => {
  return _socialAuth[provider](token);
});
_socialAuth.facebook = jest.fn();
_socialAuth.google = jest.fn();
_socialAuth.kakao = jest.fn();

export const socialAuth = _socialAuth;
