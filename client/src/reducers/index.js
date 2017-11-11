import { combineReducers } from 'redux';
import layoutReducer from './layoutReducer';
import authReducer from './authReducer';

export default combineReducers({
  layout: layoutReducer,
  auth: authReducer
});
