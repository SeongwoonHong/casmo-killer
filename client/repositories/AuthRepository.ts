import { axios } from 'utils';
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

  async login(email: string, password: string) {
    try {
      const res = await axios.post('/auth/local/login', {
        email,
        password
      });
      console.log('res = ', res);
      // console.log('data = ', data);
      return;
    } catch (e) {
      throw new Error(e);
    }
  }

  async requestSignup(email: string) {
    try {
      // const res = await axios.post('/auth/local/register', {})
      return;
    } catch (e) {
      throw new Error(e);
    }
  }

  async initialize() {
    try {
      // const res = await axios.post('/auth/initialize');

      const res = {
        data: 'testTesttestTestTest1234123',
      }
      return res;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default new AuthRepository();
