import { axios } from '~utils';
import { configs } from '~configs';

const baseUrl = `${configs.api.host}${configs.api.endpoints.auth}/token`;

export const getCsrfToken = async (): Promise<string> => {
   try {
     const response = await axios.get(
       `${baseUrl}/csrf`,
       {
         withCredentials: true,
       },
     );
     return response && response.headers
       ? response.headers [configs.headerKeys.csrf]
       : '';
   } catch (err) {
     console.error('Failed to get csrf token.');
     return '';
   }
};

export const refreshAuthToken = async () => {
  try {
    const response = await axios.post(
      `${baseUrl}/refresh`,
      {},
      {
        withCredentials: true,
      },
    );
    return response && response.headers
      ? response.headers [configs.headerKeys.auth]
      : '';
  } catch (err) {
    console.error('Failed to refresh auth token.');
    return '';}
};
