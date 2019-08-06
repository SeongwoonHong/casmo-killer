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

  login(email: string, password: string) {
    try {
      console.log('email = ', email);
      console.log('password = ', password);
      return;
    } catch (e) {
      throw new Error(e);
    }
  }

  signup(email: string) {
    try {
      console.log('email = ', email);
      return;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new AuthRepository();
