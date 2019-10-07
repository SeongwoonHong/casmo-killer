import { Props } from 'prop-types';
import { AuthStore } from 'stores/AuthStore';

declare namespace ITest1 {
  export interface IProps extends Props<{}> {
    authStore: AuthStore,
  }
}

