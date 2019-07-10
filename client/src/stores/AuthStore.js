import { observable, computed, action } from 'mobx';
import AuthRepository from 'repositories/AuthRepository';

class AuthStore {
  @observable
  user;

  @observable
  isLoading = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @computed
  get currentUser() {
    return this.user;
  }

  @action
  test = () => {
    this.user = {}
  }

  @action
  getUser = async (username) => {
    this.isLoading = true;
    const { data } = await AuthRepository.test();
    this.isLoading = false;
    this.user = data.user;
  }
}

export default AuthStore;
