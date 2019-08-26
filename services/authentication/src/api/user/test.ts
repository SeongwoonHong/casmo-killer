import * as qs from 'querystring';
import * as request from 'supertest';
import { generate as idGenerator } from 'shortid';

import { App } from '../../app';
import { TokenModel } from '../token/model';
import { UserJobs } from '../jobs.model';
import { UserModel } from '../user.model';
import { aws } from '~lib/aws';
import { configs } from '~config';
import { constants } from '~constants';
import { testUtils } from '~lib/test-utils';

const {
  API_ROOT,
  COOKIE_AUTH_KEY_NAME,
  MSG_FOR_REQUEST_EMAIL_CHANGE,
} = configs;
const {
  HEADER_NAME_FOR_ACCESS_TOKEN: authHeaderName,
  HEADER_NAME_FOR_CSRF_TOKEN: csrfHeaderName,
  JOB_NAME_FOR_EMAIL_UPDATE,
} = constants;

describe('/user routes', () => {
  const app = new App().express;
  const endpoint = `${API_ROOT}/user`;

  let jobToken;
  let newUserInfo;
  let userToUpdate;

  const requestInfoUpdate = async (user, newInfo): Promise<any> => {
    const csrfOp = await testUtils.getCsrfToken(request.agent(app));
    const loginOp = await testUtils.getAccessToken(
      csrfOp.agent,
      {
        email: user.email,
        password: user.password,
      },
    );

    const updateOp = await testUtils.requestInfoUpdate(
      loginOp.agent,
      endpoint,
      user.id,
      {
        accessToken: loginOp.accessToken,
        csrfToken: csrfOp.csrfToken,
      },
      newInfo,
    );

    return {
      agent: updateOp.agent,
      response: updateOp.response,
    };
  };

  beforeAll(() => {
    userToUpdate = testUtils
      .localTestUsers
      .find((localTestUser) => {
        return localTestUser.avatar === null;
      });

    newUserInfo = {
      avatar: testUtils.imgData,
      display_name: idGenerator(),
      email: `${idGenerator()}@email.com`,
      id: userToUpdate.id,
      password: idGenerator().slice(0, 7),
    };
  });

  it('returns a list of users information using display_name', (done) => {
    const testUsers = testUtils.users;
    const queryString = {
      exclude_fields: 'id',
      search_field: 'display_name',
      search_values: testUsers
        .map(({ display_name }) => display_name)
        .join(','),
    };
    const requiredFields = UserModel.getReturnFields({
      exclude_fields: ['id'],
      search_field: 'display_name',
      search_values: testUsers.map(({ display_name }) => display_name),
    });

    request(app)
      .get(`${endpoint}?${qs.stringify(queryString)}`)
      .end((err, res: request.Response) => {
        expect(res.body.users.length).toEqual(testUsers.length);

        res.body.users.forEach((user) => {
          requiredFields.forEach((field) => {
            expect(user).toHaveProperty(field);
          });

          Object
            .keys(user)
            .filter((key) => {
              return requiredFields.includes(key);
            })
            .forEach((key) => {
              const targetUser = testUsers.find((ur) => {
                return ur.id === user.id || ur.display_name === user.display_name;
              });

              if (user[key] && targetUser[key]) {
                expect(user[key]).toEqual(targetUser[key]);
              }
            });
        });

        done();
      });
  });

  it('returns a list of users information using id and correct fields', (done) => {
    const testUsers = testUtils.users;
    const queryString = {
      exclude_fields: 'display_name',
      return_fields: 'created_at,password,social_id',
      search_values: testUsers.map(({ id }) => id).join(','),
    };
    const requiredFields = UserModel.getReturnFields({
      exclude_fields: 'display_name'.split(','),
      return_fields: 'created_at,password,social_id'.split(','),
    });

    request(app)
      .get(`${endpoint}?${qs.stringify(queryString)}`)
      .end((err, res: request.Response) => {
        expect(res.body.users.length).toEqual(testUsers.length);

        res.body.users.forEach((user) => {
          requiredFields.forEach((field) => {
            expect(user).toHaveProperty(field);
          });
        });

        done();
      });
  });

  it('returns a single user information using email', (done) => {
    const queryString = {
      search_field: 'email',
      search_values: testUtils.users[1].email,
    };

    request(app)
      .get(`${endpoint}?${qs.stringify(queryString)}`)
      .end((err, res: request.Response) => {
        Object.keys(res.body.users[0]).forEach((field) => {
          expect(res.body.users[0][field]).toEqual(testUtils.users[1][field]);
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

  it('logs out a user and removes all tokens', async (done) => {
    const {
      agent,
      accessToken,
      csrfToken,
      response,
    } = await testUtils.getLoggedInUser(
      request.agent(app),
      {
        email: testUtils.users[1].email,
        password: testUtils.users[1].password,
      },
    );

    agent
      .post(`${endpoint}/logout`)
      .set(csrfHeaderName, csrfToken)
      .set(authHeaderName, accessToken)
      .end(async (errThree, res: request.Response) => {
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);

        expect(res.status).toEqual(204);
        expect(res.header[authHeaderName]).toBeFalsy();
        expect(cookies[COOKIE_AUTH_KEY_NAME]).toBeFalsy();

        const userTokens = await TokenModel
          .query()
          .where('user_id', response.body.user.id);

        expect(userTokens).toHaveLength(0);

        done();
      });
  });

  it('request a email update', async (done) => {
    const {
      agent: _agent,
      accessToken,
      csrfToken,
    } = await testUtils.getLoggedInUser(
      request.agent(app),
      {
        email: userToUpdate.email,
        password: userToUpdate.password,
      },
    );

    _agent
      .post(`${endpoint}/${userToUpdate.id}/request/email`)
      .set(csrfHeaderName, csrfToken)
      .set(authHeaderName, accessToken)
      .send({
        new_email: newUserInfo.email,
      })
      .end((err, res: request.Response) => {
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual(MSG_FOR_REQUEST_EMAIL_CHANGE.replace(
          /<email>/,
          newUserInfo.email,
        ));

        done();
      });
  });

  it('verifies a new email with a verification token', async (done) => {
    const {
      agent: _agent,
      accessToken,
      csrfToken,
    } = await testUtils.getLoggedInUser(
      request.agent(app),
      {
        email: userToUpdate.email,
        password: userToUpdate.password,
      },
    );

    const { token } = await UserJobs
      .query()
      .findOne({
        job_name: JOB_NAME_FOR_EMAIL_UPDATE,
        user_id: userToUpdate.id,
      });

    _agent
      .post(`${endpoint}/${userToUpdate.id}/verify/email`)
      .set(csrfHeaderName, csrfToken)
      .set(authHeaderName, accessToken)
      .send({
        new_email: newUserInfo.email,
        token,
      })
      .end((err, res: request.Response) => {
        expect(res.status).toEqual(204);
        jobToken = token;

        done();
      });
  });

  it('updates user info and send out an email if email changed', async (done) => {
    const {
      response,
    } = await requestInfoUpdate(
      userToUpdate,
      {
        ...newUserInfo,
        token: jobToken,
      },
    );

    testUtils.validateLoginResponse(
      response,
      response.header['set-cookie'],
    );
    testUtils.validateLoginData(
      response,
      {
        ...userToUpdate,
        avatar: newUserInfo.avatar,
        display_name: newUserInfo.display_name,
      },
    );

    expect(response.body).toHaveProperty('message');

    const {
      message,
      user,
    } = response.body;

    expect(aws.uploadImageData).toHaveBeenCalledWith(
      userToUpdate.id,
      newUserInfo.avatar,
    );
    expect(aws.uploadImageFromUrl).not.toHaveBeenCalled();
    expect(message).toBe(MSG_FOR_REQUEST_EMAIL_CHANGE.replace(
      /<email>/,
      newUserInfo.email,
    ));
    expect(user.display_name).toEqual(newUserInfo.display_name);
    expect(user.email).toEqual(newUserInfo.email);

    const userJobs = await UserJobs
      .query()
      .where({
        job_name: JOB_NAME_FOR_EMAIL_UPDATE,
        user_id: userToUpdate.id,
      });

    expect(userJobs).toHaveLength(0);

    done();
  });

  it('logs in with an updated credential', async (done) => {
    const {
      response,
    } = await testUtils.getAccessToken(
      request(app),
      {
        email: newUserInfo.email,
        password: newUserInfo.password,
      },
    );

    testUtils.validateLoginResponse(
      response,
      response.header['set-cookie'],
    );
    testUtils.validateLoginData(
      response,
      {
        ...userToUpdate,
        avatar: newUserInfo.avatar,
        display_name: newUserInfo.display_name,
      },
    );

    done();
  });

  it('blocks a password update if it has been used', async (done) => {
    const {
      response,
    } = await requestInfoUpdate(
      {
        email: newUserInfo.email,
        id: newUserInfo.id,
        password: newUserInfo.password,
      },
      {
        ...newUserInfo,
        password: userToUpdate.password,
      },
    );
    expect(response.body).toHaveProperty('message');
    const msg = 'The new password cannot be one of previously used passwords.';
    expect(response.body.message).toEqual(msg);

    done();
  });
});
