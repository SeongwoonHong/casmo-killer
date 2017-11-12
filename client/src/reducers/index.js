import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import menuReducer from './menuReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';

export default combineReducers({
  menu: menuReducer,
  posts: postReducer,
  form: formReducer,
  auth: authReducer
});
