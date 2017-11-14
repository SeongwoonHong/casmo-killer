import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import layoutReducer from './layoutReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';

export default combineReducers({
  posts: postReducer,
  form: formReducer,
  layout: layoutReducer,
  auth: authReducer
});
