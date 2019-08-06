import { Props } from 'prop-types';

declare namespace IHamburgerMenu {
  export interface IProps extends Props<{}> {
    onClick: function,
    isOpened: boolean,
  }
}
