import * as qs from 'querystring';
import * as request from 'supertest';

import { App } from '../../app';
import { configs } from '~config';
import {
  resCookieParser,
  testUsers,
} from '~lib/test-utils';

const {
  API_ROOT,
  COOKIE_AUTH_HEADER_NAME,
  COOKIE_AUTH_KEY_NAME,
  COOKIE_CSRF_HEADER_NAME,
} = configs;

describe('/token routes', () => {
  const app = new App().express;
  const endpoint = `${API_ROOT}/user`;
  let userRecords;

  it('returns a list of users information using display_name', (done) => {
    const queryString = {
      search_field: 'display_name',
      search_values: testUsers
        .map((user) => {
          return user.display_name;
        })
        .join(','),
    };

    request(app)
      .get(`${endpoint}?${qs.stringify(queryString)}`)
      .end((err, res: request.Response) => {
        expect(res.body.users.length).toEqual(testUsers.length);

        res.body.users.forEach((user) => {
          Object
            .keys(user)
            .filter((key) => {
              return key !== 'id';
            })
            .forEach((key) => {
              const targetUser = testUsers.find((ur) => {
                return ur.email === user.email;
              });

              expect(targetUser).toBeTruthy();
              expect(user[key]).toEqual(targetUser[key]);
            });
        });

        userRecords = res.body.users;
        done();
      });
  });

  it('returns a list of users information using id', (done) => {
    const queryString = {
      search_values: userRecords
        .map((user) => {
          return user.id;
        })
        .join(','),
    };

    request(app)
      .get(`${endpoint}?${qs.stringify(queryString)}`)
      .end((err, res: request.Response) => {
        expect(res.body.users.length).toEqual(userRecords.length);

        res.body.users.forEach((user) => {
          Object
            .keys(user)
            .forEach((key) => {
              const targetUser = userRecords.find((ur) => {
                return ur.id === user.id;
              });

              expect(targetUser).toBeTruthy();
              expect(user[key]).toEqual(targetUser[key]);
            });
        });

        done();
      });
  });

  it('returns a single user information using email', (done) => {
    const testUser = userRecords[1];
    const queryString = {
      search_field: 'email',
      search_values: testUser.email,
    };

    request(app)
      .get(`${endpoint}?${qs.stringify(queryString)}`)
      .end((err, res: request.Response) => {
        Object.keys(testUser).forEach((field) => {
          expect(testUser[field]).toEqual(res.body.users[0][field]);
        });

        done();
      });
  });

  it('does not error out with empty request', (done) => {
    request(app)
      .get(endpoint)
      .end((err, res: request.Response) => {
        expect(res.status).toEqual(200);
        expect(res.body.users).toEqual([]);

        done();
      });
  });

  it('logs out a user and removes all tokens', (done) => {
    const agent = request.agent(app);

    agent
      .post(`${API_ROOT}/auth/initialize`)
      .end((err, res: request.Response) => {
        const csrfSecret = res.header[COOKIE_CSRF_HEADER_NAME];

        agent
          .post(`${API_ROOT}/auth/local/login`)
          .send({
            email: testUsers[1].email,
            password: testUsers[1].password,
          })
          .end((errTwo, resTwo: request.Response) => {
            const accessToken = resTwo.header[COOKIE_AUTH_HEADER_NAME];

            agent
              .post(`${endpoint}/logout`)
              .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
              .set(COOKIE_AUTH_HEADER_NAME, accessToken)
              .end((errThree, resThree: request.Response) => {
                const cookies = resCookieParser(resThree.header['set-cookie']);

                expect(resThree.status).toEqual(204);
                expect(resThree.header[COOKIE_AUTH_HEADER_NAME]).toBeFalsy();
                expect(cookies[COOKIE_AUTH_KEY_NAME]).toBeFalsy();

                done();
              });
          });
      });
  });

  it('updates user information', (done) => {
    const agent = request.agent(app);

    agent
      .post(`${API_ROOT}/auth/initialize`)
      .end((err, res: request.Response) => {
        const csrfSecret = res.header[COOKIE_CSRF_HEADER_NAME];

        agent
          .post(`${API_ROOT}/auth/local/login`)
          .send({
            email: testUsers[2].email,
            password: testUsers[2].password,
          })
          .end((errTwo, resTwo: request.Response) => {
            const accessToken = resTwo.header[COOKIE_AUTH_HEADER_NAME];

            agent
              .patch(`${endpoint}/${resTwo.body.id}`)
              .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
              .set(COOKIE_AUTH_HEADER_NAME, accessToken)
              .send({
                display_name: 'random_display_name',
                email: 'random@email.com',
                id: resTwo.body.id,
              })
              .end((errThree, resThree: request.Response) => {
                expect(resThree.body).toHaveProperty('user');
                expect(resThree.body.user.display_name).toEqual('random_display_name');
                expect(resThree.body.user.email).toEqual('random@email.com');

                agent
                  .patch(`${endpoint}/${resTwo.body.id}`)
                  .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
                  .set(COOKIE_AUTH_HEADER_NAME, accessToken)
                  .send({
                    display_name: testUsers[2].display_name,
                    email: testUsers[2].email,
                    id: resTwo.body.id,
                  })
                  .end(done);
              });
          });
      });
  });
});
