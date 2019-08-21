import { UserJobs } from '../jobs.model';

jest.mock('~lib/token-utils');

import {
  Response,
  agent as _agent,
} from 'supertest';

import { App } from '../../app';
import { UserModel } from '../user.model';
import { aws } from '~lib/aws';
import { configs } from '~config';
import { mailer } from '~lib/mailer';
import { testUtils } from '~lib/test-utils';
import {
  sign,
  verify,
} from '~lib/token-utils';
import { socialAuth } from '~lib/social-auth';
import { constants } from '~constants';

const {
  API_ROOT,
  COOKIE_CSRF_HEADER_NAME,
  MSG_FOR_REQUEST_SIGNUP,
} = configs;

describe('/auth routes', () => {
  const app = new App().express;
  const agent = _agent(app);
  const endpoint = `${API_ROOT}/auth`;
  const mockedToken = testUtils.mockedToken;
  const newUsers = testUtils.newUsers;
  const socialTestUsers = testUtils.socialTestUser;

  const getRegistrationToken = (user): Promise<{ token: string }> => {
    return new Promise((resolve, reject) => {
      agent
        .post(`${endpoint}/local/request`)
        .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
        .send({
          email: user.email,
          redirect_url: 'https://localhost:3000/register/<token>',
        })
        .end(async (err, res: Response) => {
          const tokenField = await UserJobs
            .query()
            .findOne({
              job_name: constants.JOB_NAME_FOR_REGISTRATION,
              token: testUtils.mockedToken,
              user_id: user.email,
            });

          resolve(tokenField);
        });
    });
  };

  let csrfSecret;
  let jobToken;

  beforeAll((done) => {
    agent
      .get(`${API_ROOT}/token/csrf`)
      .end(async (err, res: Response) => {
        csrfSecret = res.header[COOKIE_CSRF_HEADER_NAME];

        done();
      });
  });

  it('sends out a confirmation email before registering', (done) => {
    // @ts-ignore
    sign = jest.fn().mockResolvedValue(testUtils.mockedToken);

    agent
      .post(`${endpoint}/local/request`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        email: newUsers[0].email,
        redirect_url: 'https://localhost:3000/register/<token>',
      })
      .end(async (err, res: Response) => {
        expect(sign).toHaveBeenCalledWith(
          newUsers[0].email,
          'email',
          '24h',
        );
        expect(mailer.sendRegisterConfirmation).toHaveBeenCalledWith(
          newUsers[0].email,
          `https://localhost:3000/register/${mockedToken}`,
        );
        expect(res.body.message).toBe(MSG_FOR_REQUEST_SIGNUP.replace(/<email>/, newUsers[0].email));

        const tokenField = await UserJobs
          .query()
          .findOne({
            job_name: constants.JOB_NAME_FOR_REGISTRATION,
            token: testUtils.mockedToken,
            user_id: newUsers[0].email,
          });

        expect(tokenField).toBeTruthy();
        expect(tokenField.user_id).toEqual(newUsers[0].email);

        jobToken = tokenField.token;

        done();
      });
  });

  it('blocks signup request for an existing user email address', (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/request`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        email: testUsers[0].email,
        redirect_url: '<token>',
      })
      .end((err, res: Response) => {
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
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        display_name: newUsers[0].display_name,
        email: newUsers[0].email,
        password: newUsers[0].password,
        token: jobToken,
      })
      .end(async (err, res: Response) => {
        testUtils.validateLoginResponse(
          res,
          res.header['set-cookie'],
        );

        const userData = res.body.user;
        const allFields = Object.keys(userData);
        const baseFields = UserModel.getReturnFields();

        baseFields.forEach((field) => {
          expect(userData).toHaveProperty(field);
        });

        expect(allFields.indexOf('password')).toEqual(-1);
        expect(allFields).toContain('created_at');
        expect(userData.email).toBe(newUsers[0].email);
        expect(userData.display_name).toBe(newUsers[0].display_name);

        const tokenField = await UserJobs
          .query()
          .findOne({
            job_name: constants.JOB_NAME_FOR_REGISTRATION,
            token: testUtils.mockedToken,
            user_id: newUsers[0].email,
          });

        expect(tokenField).toBeFalsy();

        done();
      });
  });

  it('registers a new user with avatar url', async (done) => {
    const imgUrl = 'http://www.silverbulletlabs.com/sitebuilder/images/Remington2-469x473.jpg';
    const { token } = await getRegistrationToken(newUsers[1]);

    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: imgUrl,
        display_name: newUsers[1].display_name,
        email: newUsers[1].email,
        password: newUsers[1].password,
        token,
      })
      .end(async (errTwo, resTwo: Response) => {
        const { user } = resTwo.body;

        expect(aws.uploadImageData).not.toHaveBeenCalled();
        expect(aws.uploadImageFromUrl).toHaveBeenCalledWith(
          user.id,
          imgUrl,
        );

        const tokenField = await UserJobs
          .query()
          .findOne({
            job_name: constants.JOB_NAME_FOR_REGISTRATION,
            token,
            user_id: newUsers[1].email,
          });

        expect(tokenField).toBeFalsy();

        done();
      });
  });

  it('registers a new user with avatar data', async (done) => {
    const { token } = await getRegistrationToken(newUsers[2]);

    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUtils.imgData,
        display_name: newUsers[2].display_name,
        email: newUsers[2].email,
        password: newUsers[2].password,
        token,
      })
      .end(async (err, res: Response) => {
        expect(aws.uploadImageData).toHaveBeenCalledWith(
          res.body.user.id,
          testUtils.imgData,
        );
        expect(aws.uploadImageFromUrl).not.toHaveBeenCalled();

        const tokenField = await UserJobs
          .query()
          .findOne({
            job_name: constants.JOB_NAME_FOR_REGISTRATION,
            token,
            user_id: newUsers[2].email,
          });

        expect(tokenField).toBeFalsy();

        done();
      });
  });

  it('blocks a registration if email is already taken', async (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUsers[0].avatar,
        display_name: 'randomdisplay',
        email: testUsers[0].email,
        password: testUsers[0].password,
        token: 'asvasdfavasdfasdf',
      })
      .end((err, res: Response) => {
        expect(res.body.message).toEqual('The value for email is already taken.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('blocks a registration if display name is already taken', async (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUsers[0].avatar,
        display_name: testUsers[0].display_name,
        email: 'random@email.com',
        password: testUsers[0].password,
        token: 'asvasdfavasdfasdf',
      })
      .end((err, res: Response) => {
        expect(res.body.message).toEqual('The value for display name is already taken.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('logs in a user', (done) => {
    const testUsers = testUtils.localTestUsers;

    // @ts-ignore
    verify = jest.fn().mockResolvedValue({});

    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      })
      .end((err, res: Response) => {
        expect(verify).toHaveBeenCalled();
        testUtils.validateLoginResponse(
          res,
          res.header['set-cookie'],
        );
        testUtils.validateLoginData(
          res,
          testUsers[0],
        );

        done();
      });
  });

  it('blocks a login with an unauthorized email', (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: 'utjw823787@email.com',
        password: testUsers[1].password,
      })
      .end((err, res: Response) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('User not found.');

        done();
      });
  });

  it('blocks a login with an incorrect password', (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: testUsers[0].email,
        password: testUsers[1].password,
      })
      .end((err, res: Response) => {
        expect(res.body.success).toEqual(false);
        expect(res.body.message).toEqual('Password is incorrect.');

        done();
      });
  });

  it('returns a social profile if not registered when logging in', (done) => {
    const payload = {
      accessToken: 'asdfasdfasdfasdfasdfasdfasdfasdf',
      provider: 'google',
    };
    const socialProfile = {
      avatar: null,
      display_name: 'social_user_one',
      social_id: 'asdfasdfasdfasdf',
      social_token: 'zxcvzxcvzxcv',
      strategy: 'facebook',
    };
    socialAuth[payload.provider] = jest.fn().mockResolvedValue(socialProfile);

    agent
      .post(`${endpoint}/social/login`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send(payload)
      .end((err, res: Response) => {
        expect(res.body).toHaveProperty('profile');
        expect(res.body.profile).toEqual(socialProfile);
        expect(res.body.should_register).toBe(true);
        expect(socialAuth[payload.provider]).toHaveBeenCalledWith(payload.accessToken);

        done();
      });
  });

  it('logs in a social user', (done) => {
    const payload = {
      accessToken: 'asdfasdfasdfasdfasdfasdfasdfasdf',
      provider: 'google',
    };
    const socialProfile = {
      avatar: null,
      display_name: socialTestUsers[0].display_name,
      social_id: socialTestUsers[0].social_id,
      social_token: payload.accessToken,
      strategy: socialTestUsers[0].strategy,
    };
    socialAuth[payload.provider] = jest.fn().mockResolvedValue(socialProfile);

    agent
      .post(`${endpoint}/social/login`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send(payload)
      .end((err, res: Response) => {
        testUtils.validateLoginResponse(
          res,
          res.header['set-cookie'],
        );
        testUtils.validateLoginData(
          res,
          socialTestUsers[0],
        );

        done();
      });
  });

  it('registers a new social user', (done) => {
    const payload = {
      avatar: null,
      display_name: 'social_tester_two',
      social_id: 'ec2cd494d3c8484aaaa36e7663e42c18',
      social_token: 'asdfasdfasdfasdfasdfasdf',
      strategy: 'facebook',
    };
    const socialProfile = {
      avatar: null,
      display_name: payload.display_name,
      social_id: payload.social_id,
      social_token: payload.social_token,
      strategy: payload.strategy,
    };
    socialAuth[payload.strategy] = jest.fn().mockResolvedValue(socialProfile);

    agent
      .post(`${endpoint}/social/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send(payload)
      .end((err, res: Response) => {
        testUtils.validateLoginResponse(
          res,
          res.header['set-cookie'],
        );
        testUtils.validateLoginData(
          res,
          payload,
        );

        done();
      });
  });

  it('blocks a social user registration when a social id is incorrect', (done) => {
    const payload = {
      avatar: null,
      display_name: 'social_tester_two',
      social_id: 'ec2cd494d3c8484aaaa36e7663e42c18',
      social_token: 'asdfasdfasdfasdfasdfasdf',
      strategy: 'facebook',
    };
    const socialProfile = {
      avatar: null,
      display_name: payload.display_name,
      social_id: 'ec2cd494d3c8484aaaa36e7663e42c19',
      social_token: payload.social_token,
      strategy: payload.strategy,
    };
    socialAuth[payload.strategy] = jest.fn().mockResolvedValue(socialProfile);

    agent
      .post(`${endpoint}/social/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send(payload)
      .end((err, res: Response) => {
        expect(res.body.message).toEqual('Incorrect social profile information provided.');
        expect(res.body.success).toBe(false);

        done();
      });
  });
});
