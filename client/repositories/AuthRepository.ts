import axios from 'axios';
import UserModel from 'models/UserModel';

const fakeUser = {
  username: 'eleven',
  displayName: 'El',
  thumbnail: null,
}

class AuthRepository {
  URL: string = 'api/something/something';

  findUser(username: string) {
    return axios.get(`${this.URL}`, {
      params: {
        username
      }
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
  }

  test() {
    return {
      data: {
        user: new UserModel(fakeUser)
      }
    }
  }
}

export default new AuthRepository();
