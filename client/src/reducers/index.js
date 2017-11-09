import { combineReducers } from 'redux';
import menuReducer from './menuReducer';
import authReducer from './authReducer';

export default combineReducers({
  menu: menuReducer,
  auth: authReducer
});
