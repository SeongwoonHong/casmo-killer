import axios from 'axios';

/* ACTION TYPES */
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';

/* ACTION CREATOR */
export const login = (email: string, password: string) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN,
      });
      const res = await axios.post('/auth/local/login', {
        email,
        password
      });

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      })
    } catch (e) {
      console.log(e);
      dispatch({ type: LOGIN_FAIL });
      throw new Error(e);
    }
  }
}

export const requestSignup = (email: string) => {
  return () => {
    // axios.post('/auth/local/register', {
    //   email
    // })
  }
};

export const initialize = () => {
  return async (dispatch) => {
    try {
      // const res = await axios.post('/auth/initialize');

      const res = {
        data: 'testTesttestTestTest1234123',
      }

      // save this data somewhere
      // ...
    } catch (e) {
      console.log(e)
      throw new Error(e);
    }
  }
};

const initialState = {
  user: null,
  isLoading: false,
}

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
      }
    case LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state;
  }
}
