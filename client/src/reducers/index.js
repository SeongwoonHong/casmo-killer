import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import layoutReducer from './layoutReducer';
import userReducer from './userReducer';
import postReducer from './postReducer';

export default combineReducers({
  posts: postReducer,
  form: formReducer,
  layout: layoutReducer,
  user: userReducer
});
