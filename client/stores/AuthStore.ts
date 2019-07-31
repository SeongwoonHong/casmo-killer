import { observable, computed, action } from 'mobx';
import AuthRepository from 'repositories/AuthRepository';
import Router from 'next/router';

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
  getUser = async () => {
    this.isLoading = true;
    const { data } = await AuthRepository.test();
    this.isLoading = false;
    this.user = data.user;

    return data.user;
  }

  @action
  login = (email: string, password: string) => {
    try {
      AuthRepository.login(email, password);
      Router.push('/signup')
    } catch (e) {
      throw new Error(e);
    }
  }

  @action
  signup = (email: string) => {
    try {
      AuthRepository.signup(email);
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default AuthStore;
