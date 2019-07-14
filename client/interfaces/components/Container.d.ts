import { Props } from 'prop-types';

declare namespace IContainer {
  export interface IProps extends Props<{}> {
    title: string;
    children: JSX.Element[] | JSX.Element,
  }
}

