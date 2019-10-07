import { axios } from '~utils';
import { configs } from '~configs';

const baseUrl = `${configs.api.host}${configs.api.endpoints.auth}`;

export const requestLocalRegister = async (
  avatar: any,
  display_name: string,
  email: string,
  password: string,
  token: string,
) => {
  return axios.post(
    `${baseUrl}/auth/local/register`,
    {
      email,
      password,
      display_name,
      avatar,
      token,
    },
    {
      withCredentials: true,
    }
  );
};

export const requestLocalSignup = async (email: string): Promise<any> => {
  return axios.post<{ message: string }>(
    `${baseUrl}/job/signup/request`,
    {
      email,
    },
    {
      withCredentials: true,
    },
  );
};
