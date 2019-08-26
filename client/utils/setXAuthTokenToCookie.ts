import { Cookies } from 'react-cookie';

export function setXAuthTokenToCookie (token) {
  const cookies = new Cookies();

  return cookies.set('x-auth-token', token);
}
