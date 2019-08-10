import { Props } from 'prop-types';

declare namespace IAuthFormContainer {
  export interface IProps extends Props<{}> {
    mode: string,
    loginInputs?: Array<object>,
    signupInputs?: Array<object>,
    authOnClick: function,
    errors: object,
  }
}
