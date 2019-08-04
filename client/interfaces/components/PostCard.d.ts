import { Props } from 'prop-types';

declare namespace IPostCard {
  export interface IProps extends Props<{}> {
    img: string,
    title: string,
    author: string,
    comments: number,
  }
}
