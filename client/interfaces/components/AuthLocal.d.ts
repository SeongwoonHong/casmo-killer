import { Props } from 'prop-types';

declare namespace IAuthLocal {
  export interface IProps extends Props<{}> {
    mode: string,
    inputs: array,
    setEmail: function,
    setPassword: function,
  }
}
