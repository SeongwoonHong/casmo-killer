import * as request from 'supertest';

import { App } from '../../app';
import { UserModel } from '../user.model';
import { TokenModel } from './model';
import { configs } from '~config';
import {
  extPrsHeader,
  sign,
} from '~lib/token-utils';
import { testUtils } from '~lib/test-utils';

const {
  API_ROOT,
  COOKIE_AUTH_HEADER_NAME,
  COOKIE_AUTH_KEY_NAME,
  COOKIE_CSRF_HEADER_NAME,
  COOKIE_CSRF_KEY_NAME,
  RSA_KEY_PAIRS,
} = configs;

describe('/token routes', () => {
  const app = new App().express;
  const agent = request.agent(app);
  const endpoint = `${API_ROOT}/token`;
  const testUsers = testUtils.localTestUsers;

  let accessToken;
  let csrfSecret;
  let refreshToken;

  it('receives csrf token and secret in the response', (done) => {
    agent
      .get(`${endpoint}/csrf`)
      .end((err, res: request.Response) => {
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_CSRF_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_CSRF_HEADER_NAME);

        csrfSecret = res.header[COOKIE_CSRF_HEADER_NAME];

        agent
          .post(`${API_ROOT}/auth/local/login`)
          .send({
            email: testUsers[0].email,
            password: testUsers[0].password,
          })
          .end((errTwo, resTwo: request.Response) => {
            const cookiesTwo = testUtils.resCookieParser(resTwo.header['set-cookie']);

            refreshToken = cookiesTwo[COOKIE_AUTH_KEY_NAME] || '';
            accessToken = resTwo.header[COOKIE_AUTH_HEADER_NAME];

            done();
          });
      });
  });

  it('does not issue new csrf token and secret if already issued', (done) => {
    agent
      .get(`${endpoint}/csrf`)
      .end((err, res: request.Response) => {
        expect(res.header).not.toHaveProperty('set-cookie');
        expect(res.header).not.toHaveProperty(COOKIE_CSRF_HEADER_NAME);

        done();
      });
  });

  it('fetches public key to be used verify jwt token', (done) => {
    const {
      kid,
    } = extPrsHeader<{ [key: string]: string}>(accessToken);

    agent
      .get(`${endpoint}/secret/${kid}`)
      .set(COOKIE_AUTH_HEADER_NAME, accessToken)
      .end((err, res: request.Response) => {
        expect(res.body).toHaveProperty('public_key');
        expect(res.body.public_key).toEqual(RSA_KEY_PAIRS[kid].public);

        done();
      });
  });

  it('blocks public key request for unauthorized request', (done) => {
    const {
      kid,
    } = extPrsHeader<{ [key: string]: string}>(accessToken);

    request(app)
      .get(`${endpoint}/secret/${kid}`)
      .end((err, res: request.Response) => {
        expect(res.body.message).toEqual('Unauthorized Access');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('refreshes access token and refresh token for a user', (done) => {
    agent
      .post(`${endpoint}/refresh`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .end((err, res: request.Response) => {
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);
        const newAccessToken = res.header[COOKIE_AUTH_HEADER_NAME];
        const newRefreshToken = cookies[COOKIE_AUTH_KEY_NAME];

        expect(newAccessToken).toBeTruthy();
        expect(newRefreshToken).toBeTruthy();
        expect(accessToken).not.toEqual(newAccessToken);
        expect(refreshToken).not.toEqual(newRefreshToken);
        expect(res.body).toHaveProperty('user');

        UserModel.getReturnFields().forEach((field) => {
          expect(res.body.user).toHaveProperty(field);
        });

        done();
      });
  });

  it('does not store expired refresh tokens in db', (done) => {
    agent
      .post(`${API_ROOT}/auth/local/login`)
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      })
      .end(async (err, res: request.Response) => {
        const rows = await TokenModel
          .query()
          .where('user_id', res.body.user.id);

        expect(rows).toHaveLength(1);
        done();
      });
  });

  it('blocks token refresh request for unauthorized request', (done) => {
    request(app)
      .post(`${endpoint}/refresh`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .end((err, res: request.Response) => {
        expect(res.body.message).toEqual('Malformed request');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('returns verified token payload', async (done) => {
    const payload = {
      test: 'payload',
    };
    const subject = 'payload';
    const token = await sign(payload, subject);

    agent
      .post(`${endpoint}/verify`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        token,
      })
      .end((err, res: request.Response) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty(subject);
        expect(res.body.data.payload).toEqual(payload);

        done();
      });
  });
});
