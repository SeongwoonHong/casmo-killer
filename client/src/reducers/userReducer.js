import jwtDecode from 'jwt-decode';

import * as types from '../actions/types';
import { getToken } from '../utils/cookies';

const initialState = (token => ({
  user: {
    isLoggedIn: token !== undefined,
    _id: token ? jwtDecode(token)._id : null,
    username: token ? jwtDecode(token).username : null,
    avatar: token ? jwtDecode(token).avatar : null,
  }
}))(getToken());

export default function (state = initialState.user, action) {

  switch (action.type) {

    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isLoggedIn: true,
        _id: jwtDecode(action.token)._id,
        username: jwtDecode(action.token).username,
        avatar: jwtDecode(action.token).avatar
      });

    case types.LOGOUT:
      return initialState.user;

    default:
      return state;

  }

}
