import { observable, computed, action } from 'mobx';
import AuthRepository from 'repositories/AuthRepository';

class AuthStore {
  rootStore;

  @observable
  user: object;

  @observable
  isLoading: boolean = false;

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
  getUser = async () => {
    this.isLoading = true;
    const { data } = await AuthRepository.test();
    this.isLoading = false;
    this.user = data.user;

    return data.user;
  }
}

export default AuthStore;
