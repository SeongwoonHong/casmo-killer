import { Props } from 'prop-types';

declare namespace IAuthForm {
  export interface IProps extends Props<{}> {
    mode: string,
    loginInputs?: Array<object>,
    signupInputs?: Array<object>,
    authOnClick: function,
    setEmail: function,
    setPassword: function,
  }
}
