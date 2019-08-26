import { axios, setTokenToHeader, setXAuthTokenToCookie } from 'utils';

/* ACTION TYPES */
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const SIGNUP = 'SIGNUP';
const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
const SIGNUP_FAIL = 'SIGNUP_FAIL';
const LOGOUT = 'LOGOUT';

/* ACTION CREATOR */

const loginSuccess = (user) => {
  console.log('user = ', user)
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const login = (email: string, password: string) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN,
      });
      const res = await axios.post('/auth/local/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });
      
      setXAuthTokenToCookie(res.headers['x-auth-token']);

      dispatch(loginSuccess(res.data.user));
    } catch (e) {
      console.log(e);
      dispatch({ type: LOGIN_FAIL });
    }
  };
};

export const requestSignup = (email: string) => {
  return axios.post('/auth/local/request', {
    email
  }, {
    withCredentials: true
  });
};

export const signup = ({
  email,
  password,
  displayName,
  avatar = null,
}) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: SIGNUP,
      });

      const res = await axios.post('/auth/local/register', {
        email,
        password,
        displayName,
        avatar,
      });

      dispatch({
        type: SIGNUP_SUCCESS,
        payload: {
          email,
          displayName,
          userId: 1,
        },
      });
    } catch (e) {
      console.log(e);
      dispatch({
        type: SIGNUP_FAIL,
      });
    }
  };
};

export const initialize = async () => {
  try {
    const res = await axios.get('/token/csrf', {
      withCredentials: true,
    });
    const csrfToken = res.headers['x-csrf-token'];

    if (csrfToken) {
      setTokenToHeader('x-csrf-token', csrfToken);
    }
  } catch (e) {
    console.log(e);
  }
};

export const tokenRefresh = async () => {
  try {
    const res = await axios.post(
      '/token/refresh',
      {},
      {
        withCredentials: true,
      },
    );

    setXAuthTokenToCookie(res.headers['x-auth-token']);
  } catch (e) {
    if (e.response.status !== 401) {
      console.log(e);
    }
  }
};

export const tokenVerify = (token) => {
  return async (dispatch) => {
    try {
      const res = await axios.post('/token/verify', {
        token
      }, {
        withCredentials: true
      });

      return dispatch(loginSuccess(res.data.user));
    } catch (e) {
      console.log(e);
    }
  }
}

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
      console.log('action.payload = ', action.payload)
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
        user: action.payload,
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
