import { Props } from 'prop-types';

declare namespace IButton {
  export interface IProps extends Props<{}> {
    onClick?: function,
    children: any,
    className?: string,
  }
}
