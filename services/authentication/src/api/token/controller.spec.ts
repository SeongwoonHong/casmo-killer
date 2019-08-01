import * as request from 'supertest';

import { App } from '../../app';
import { configs } from '~config';
import { extPrsHeader } from '~lib/token-utils';
import { testUsers } from '~lib/test-utils';

const {
  API_ROOT,
  COOKIE_AUTH_HEADER_NAME,
  RSA_KEY_PAIRS,
} = configs;

describe('/token routes', () => {
  const app = new App().express;
  const agent = request.agent(app);
  const endpoint = `${API_ROOT}/token`;

  let accessToken;

  beforeAll(async (done) => {
    agent
      .post(`${endpoint}/initialize`)
      .end(() => {
        agent
          .post(`${API_ROOT}/auth/local/login`)
          .send({
            email: testUsers[0].email,
            password: testUsers[0].password,
          })
          .end((err, resTwo: request.Response) => {
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
});
