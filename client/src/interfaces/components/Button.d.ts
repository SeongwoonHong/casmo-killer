import { Props } from 'prop-types';

declare namespace IButton {
  export interface IProps extends Props<{}> {
    onClick?: function,
    type?: any, 
    children: any,
    className?: string,
    disabled?: boolean,
  }
}
