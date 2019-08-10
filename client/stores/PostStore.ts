import { observable, action, toJS } from 'mobx';
import PostRepository from 'repositories/PostRepository';
import PostCards from 'models/PostCard';

class PostCardStore {
  rootStore;

  @observable
  isLoading: boolean = false;

  @observable
  postCards;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @action
  getPostCards = async () => {
    try {
      if (this.postCards) {
        return;
      }
      this.isLoading = true;
      this.postCards = await PostRepository.getPostCards();
      this.isLoading = false;
    } catch (e) {
      console.log(e.message)
      this.isLoading = false;
    }
  }
}

export default PostCardStore;
