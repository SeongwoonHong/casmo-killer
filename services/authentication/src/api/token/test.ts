import * as request from 'supertest';

import { App } from '../../app';
import { configs } from '~config';
import {
  extPrsHeader,
  sign,
} from '~lib/token-utils';
import {
  resCookieParser,
  testUsers,
} from '~lib/test-utils';

const {
  API_ROOT,
  COOKIE_AUTH_HEADER_NAME,
  COOKIE_AUTH_KEY_NAME,
  COOKIE_CSRF_HEADER_NAME,
  RSA_KEY_PAIRS,
} = configs;

describe('/token routes', () => {
  const app = new App().express;
  const agent = request.agent(app);
  const endpoint = `${API_ROOT}/token`;

  let accessToken;
  let refreshToken;
  let csrfSecret;

  beforeAll(async (done) => {
    agent
      .post(`${API_ROOT}/auth/initialize`)
      .end((err, res: request.Response) => {
        csrfSecret = res.header[COOKIE_CSRF_HEADER_NAME];

        agent
          .post(`${API_ROOT}/auth/local/login`)
          .send({
            email: testUsers[0].email,
            password: testUsers[0].password,
          })
          .end((errTwo, resTwo: request.Response) => {
            const cookies = resCookieParser(resTwo.header['set-cookie']);

            refreshToken = cookies[COOKIE_AUTH_KEY_NAME] || '';
            accessToken = resTwo.header[COOKIE_AUTH_HEADER_NAME];

            done();
          });
      });
  });

  it('fetches public key to be used verify jwt token', (done) => {
    const tokenHeader = extPrsHeader<{ [key: string]: string}>(accessToken);

    expect(tokenHeader).toHaveProperty('kid');

    const {
      kid,
    } = tokenHeader;

    agent
      .get(`${endpoint}/secret/${kid}`)
      .set(COOKIE_AUTH_HEADER_NAME, accessToken)
      .end((err, res: request.Response) => {
        expect(res.body.public_key).toEqual(RSA_KEY_PAIRS[kid].public);

        done();
      });
  });

  it('blocks public key request for unauthorized request', (done) => {
    const tokenHeader = extPrsHeader<{ [key: string]: string}>(accessToken);

    request(app)
      .get(`${endpoint}/secret/${tokenHeader.kid}`)
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
      .set(COOKIE_AUTH_HEADER_NAME, accessToken)
      .end((err, res: request.Response) => {
        const cookies = resCookieParser(res.header['set-cookie']);
        const newAccessToken = res.header[COOKIE_AUTH_HEADER_NAME];
        const newRefreshToken = cookies[COOKIE_AUTH_KEY_NAME];

        expect(accessToken).toBeTruthy();
        expect(newAccessToken).toBeTruthy();
        expect(refreshToken).toBeTruthy();
        expect(newRefreshToken).toBeTruthy();
        expect(accessToken === newAccessToken).toBe(false);
        expect(refreshToken === newRefreshToken).toBe(false);

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

        agent
          .post(`${API_ROOT}/auth/initialize`)
          .end((errTwo, resTwo: request.Response) => {
            csrfSecret = resTwo.header[COOKIE_CSRF_HEADER_NAME];

            done();
          });
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
        subject,
        token,
      })
      .end((err, res: request.Response) => {
        expect(res.body).toEqual(payload);

        done();
      });
  });

  it('does not return token payload for a wrong subject', async (done) => {
    const payload = {
      test: 'payload',
    };
    const subject = 'payload';
    const token = await sign(payload, subject);

    agent
      .post(`${endpoint}/verify`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        subject: `${subject}er`,
        token,
      })
      .end((err, res: request.Response) => {
        expect(res.body.message).toEqual('Malformed request');
        expect(res.body.success).toBe(false);

        done();
      });
  });
});
