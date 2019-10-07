import { Props } from 'prop-types';

declare namespace ISocial {
  export interface IProps extends Props<{}> {
    icon: string,
    id: string,
    clientId: string,
    onSuccess: function,
    onFailure: function,
    className: string,
    children: any,
  }
}
