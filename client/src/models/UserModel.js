import { observable, computed, action, set } from 'mobx';

class UserModel {
  @observable
  username;

  @observable
  displayName;

  @observable
  thumbnail;

  constructor(data) {
    set(this, data);
  }

  @computed
  get getUsername() {
    return this.username;
  }

  @action
  changeUsername(username) {
    this.username = username;
  }
}

export default UserModel;
