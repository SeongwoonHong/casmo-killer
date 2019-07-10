import axios from 'axios';
import UserModel from 'models/UserModel';

const fakeUser = {
  username: 'eleven',
  displayName: 'El',
  thumbnail: null,
}

class AuthRepository {
  URL = 'api/something/something';

  constructor(url) {
    this.URL = url || this.URL;
  }

  findUser(username) {
    return axios.get(`${this.URL}`, {
      params: {
        username
      }
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  }

  test(token) {
    return {
      data: {
        user: new UserModel(fakeUser)
      }
    }
  }
}

export default new AuthRepository();
