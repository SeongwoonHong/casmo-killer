import * as request from 'supertest';

import { App } from '../../app';
import { configs } from '~config';
import { testUsers } from '~lib/test-utils';
import { UserModel } from '../user.model';

const {
  API_ROOT,
  COOKIE_AUTH_HEADER_NAME,
  COOKIE_AUTH_KEY_NAME,
  COOKIE_CSRF_HEADER_NAME,
  COOKIE_CSRF_KEY_NAME,
} = configs;

describe('/auth routes', () => {
  const app = new App().express;
  const agent = request.agent(app);
  const endpoint = `${API_ROOT}/auth`;
  let newUser = {
    display_name: 'newuser',
    email: 'newuser@damso.com',
    id: null,
    password: 'newpassword',
  };

  beforeAll((done) => {
    agent
      .post(`${endpoint}/initialize`)
      .end(() => {
        done();
      });
  });

  it('receives csrf token and secret in the response', (done) => {
    agent
      .post(`${endpoint}/initialize`)
      .end(async (err, res) => {
        const cookies = res.header['set-cookie'].map((cookie) => {
          return cookie.indexOf(COOKIE_CSRF_KEY_NAME) > -1;
        });

        expect(cookies).toBeTruthy();
        expect(res.header).toHaveProperty(COOKIE_CSRF_HEADER_NAME);

        done();
      });
  });

  it('sends out a confirmation email before registering', (done) => {
    agent
      .post(`${endpoint}/local/request`)
      .send({
        email: newUser.email,
      })
      .end((err, res: request.Response) => {
        // tslint:disable-next-line:max-line-length
        expect(res.body.message).toBe(`Verification email has been sent to ${newUser.email}. Please click the link in the email to sign up.`);
        done();
      });
  });

  it('blocks signup request for an existing user email address', (done) => {
    agent
      .post(`${endpoint}/local/request`)
      .send({
        email: testUsers[0].email,
      })
      .end((err, res: request.Response) => {
        expect(res.body.message).toBe('The email address is already taken.');
        done();
      });
  });

  it('registers a new user and returns correct fields', (done) => {
    const returnFields = [
      'password',
      'created_at',
    ];
    agent
      .post(`${endpoint}/local/register?return_fields=${returnFields.join(',')}`)
      .send({
        display_name: newUser.display_name,
        email: newUser.email,
        password: newUser.password,
      })
      .end((err, res: request.Response) => {
        const cookies = res.header['set-cookie'].map((cookie) => {
          return cookie.indexOf(COOKIE_AUTH_KEY_NAME) > -1;
        });

        expect(cookies).toBeTruthy();
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);

        const allFields = Object.keys(res.body);

        expect(allFields).toContain('id');
        expect(allFields.indexOf('password')).toEqual(-1);
        expect(allFields).toContain('created_at');
        expect(res.body.email).toBe(newUser.email);
        expect(res.body.display_name).toBe(newUser.display_name);

        newUser = {
          ...newUser,
          id: res.body.id,
        };

        done();
      });
  });

  it('blocks a registration if email is already taken', (done) => {
    agent
      .post(`${endpoint}/local/register`)
      .send({
        ...testUsers[0],
        display_name: 'randomdisplay',
      })
      .end((err, res: request.Response) => {
        expect(res.body.message).toEqual('The value for email is already taken.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('blocks a registration if display name is already taken', (done) => {
    agent
      .post(`${endpoint}/local/register`)
      .send({
        ...testUsers[0],
        email: 'random@email.com',
      })
      .end((err, res: request.Response) => {
        expect(res.body.message).toEqual('The value for display name is already taken.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('logs in a user', (done) => {
    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      })
      .end((err, res: request.Response) => {
        const cookies = res.header['set-cookie'].map((cookie) => {
          return cookie.indexOf(COOKIE_AUTH_KEY_NAME) > -1;
        });

        expect(cookies).toBeTruthy();
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toEqual(testUsers[0].email);
        expect(res.body.display_name).toEqual(testUsers[0].display_name);

        done();
      });
  });

  it('blocks a login with an incorrect email', (done) => {
    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: 'random@email.com',
        password: testUsers[1].password,
      })
      .end((err, res: request.Response) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('User not found.');

        done();
      });
  });

  it('blocks a login with an incorrect password', (done) => {
    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: testUsers[0].email,
        password: testUsers[1].password,
      })
      .end((err, res: request.Response) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Password is incorrect.');

        done();
      });
  });

  afterAll(async (done) => {
    await UserModel
      .query()
      .deleteById(newUser.id);

    done();
  });
});
