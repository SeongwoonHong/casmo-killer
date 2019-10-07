import { configs } from '../../configs';
import { axios, setTokenToHeader, setXAuthTokenToCookie } from '~utils';
import { getCsrfToken, refreshAuthToken } from '~services/tokenServices';
import { requestLocalRegister } from '~services/authServices';

/* ACTION TYPES */
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const SIGNUP = 'SIGNUP';
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'SIGNUP_FAIL';
const LOGOUT = 'LOGOUT';

/* ACTION CREATOR */
const baseUrl = `${configs.api.host}${configs.api.endpoints.auth}`;

const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN,
      });
      const res = await axios.post(`${baseUrl}/auth/local/login`, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      setXAuthTokenToCookie(res.headers['x-auth-token']);

      return dispatch(loginSuccess(res.data.user));
    } catch (e) {
      console.log(e);
      dispatch({ type: LOGIN_FAIL });
      throw new Error(e);
    }
  };
};

export const signup = ({
  email,
  password,
  displayName,
  verificationCode,
  avatar = null,
}) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SIGNUP,
      });
      const response = await requestLocalRegister(
        avatar,
        displayName,
        email,
        password,
        verificationCode,
      );

      return dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.user,
      });
    } catch (e) {
      console.log(e);
      return dispatch({
        type: SIGNUP_FAIL,
      });
    }
  };
};

export const initialize = async () => {
  try {
    const csrfToken = await getCsrfToken();

    if (csrfToken) {
      setTokenToHeader(configs.headerKeys.csrf, csrfToken);
    }
    const authToken = await refreshAuthToken();

    if (authToken) {
      setTokenToHeader(configs.headerKeys.auth, authToken);
    }
  } catch (e) {
    console.log(e);
  }
};

export const tokenVerify = (token) => {
  return async (dispatch) => {
    try {
      const res = await axios.post(`${baseUrl}/token/verify`, {
        token,
      }, {
        withCredentials: true,
      });

      return dispatch(loginSuccess(res.data.user));
    } catch (e) {
      console.log(e);
    }
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

const initialState = {
  user: null,
  isLoading: false,
};

/* REDUCER */
export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case SIGNUP:
      return {
        ...state,
        isLoading: true,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
