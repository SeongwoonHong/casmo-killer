import AuthStore from './AuthStore';

class RootStore {
  constructor() {
    this.AuthStore = new AuthStore(this);
  }
}

export default RootStore;
