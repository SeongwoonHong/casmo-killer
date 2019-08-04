import { observable, set } from 'mobx';

class PostCard {
  @observable
  img: string;

  @observable
  title: string;

  @observable
  author: string;

  @observable
  comments: string;

  constructor(data: object) {
    set(this, data);
  }
}

export default PostCard;
