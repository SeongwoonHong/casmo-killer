import { observable, computed, action, set } from 'mobx';

class UserModel {
  @observable
  username: string;

  @observable
  displayName: string;

  @observable
  thumbnail: string;

  constructor(data: object) {
    set(this, data);
  }

  @computed
  get getUsername() {
    return this.username;
  }

  @action
  changeUsername(username: string) {
    this.username = username;
  }
}

export default UserModel;
