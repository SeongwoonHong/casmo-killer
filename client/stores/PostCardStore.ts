import { observable, action, toJS } from 'mobx';
import PostCardRepository from 'repositories/PostCardRepository';
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
      this.isLoading = true;
      this.postCards = await PostCardRepository.getPostCards();
      this.isLoading = false;
    } catch (e) {
      console.log(e.message)
      this.isLoading = false;
    }
  }
}

export default PostCardStore;
