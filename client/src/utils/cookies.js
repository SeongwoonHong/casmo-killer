import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getToken = () => {

  return cookies.get('ck-token');

};

export const setToken = (token) => {

  return new Promise((resolve, reject) => {

    cookies.set('ck-token', token);

    if (getToken() !== undefined) {
      resolve(getToken());
    } else {
      reject();
    }

  });

};

export const removeToken = () => {

  return new Promise((resolve, reject) => {

    cookies.remove('ck-token');

    if (getToken() === undefined) {
      resolve();
    } else {
      reject();
    }

  });

};
