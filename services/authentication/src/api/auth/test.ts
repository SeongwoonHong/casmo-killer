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
import { sign } from '~lib/token-utils';
import { socialAuth } from '~lib/social-auth';

const {
  API_ROOT,
  COOKIE_AUTH_HEADER_NAME,
  COOKIE_AUTH_KEY_NAME,
  COOKIE_CSRF_HEADER_NAME,
} = configs;

describe('/auth routes', () => {
  const app = new App().express;
  const agent = _agent(app);
  const endpoint = `${API_ROOT}/auth`;
  const mockedToken = testUtils.mockedToken;
  const newUsers = testUtils.newUsers;
  const socialTestUsers = testUtils.socialTestUser;

  let csrfSecret;

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
      .end((err, res: Response) => {
        expect(sign).toHaveBeenCalledWith(
          {
            email: newUsers[0].email,
          },
          'email',
        );
        expect(mailer.sendRegisterConfirmation).toHaveBeenCalledWith(
          newUsers[0].email,
          `https://localhost:3000/register/${mockedToken}`,
        );
        // tslint:disable-next-line:max-line-length
        expect(res.body.message).toBe(`Verification email has been sent to ${newUsers[0].email}. Please click the link in the email to sign up.`);
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
      })
      .end((err, res: Response) => {
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
        expect(res.body).toHaveProperty('user');

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

        newUsers[0].id = userData.id;

        done();
      });
  });

  it('registers a new user with avatar url', (done) => {
    const imgUrl = 'http://www.silverbulletlabs.com/sitebuilder/images/Remington2-469x473.jpg';
    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: imgUrl,
        display_name: newUsers[1].display_name,
        email: newUsers[1].email,
        password: newUsers[1].password,
      })
      .end((err, res: Response) => {
        const { user } = res.body;

        expect(aws.uploadImageData).not.toHaveBeenCalled();
        expect(aws.uploadImageFromUrl).toHaveBeenCalledWith(
          user.id,
          imgUrl,
        );
        newUsers[1].id = user.id;

        done();
      });
  });

  it('registers a new user with avatar data', (done) => {
    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUtils.imgData,
        display_name: newUsers[2].display_name,
        email: newUsers[2].email,
        password: newUsers[2].password,
      })
      .end((err, res: Response) => {
        expect(aws.uploadImageData).toHaveBeenCalledWith(
          res.body.user.id,
          testUtils.imgData,
        );
        expect(aws.uploadImageFromUrl).not.toHaveBeenCalled();
        expect(true).toBeTruthy();
        newUsers[2].id = res.body.user.id;

        done();
      });
  });

  it('blocks a registration if email is already taken', (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUsers[0].avatar,
        display_name: 'randomdisplay',
        email: testUsers[0].email,
        password: testUsers[0].password,
      })
      .end((err, res: Response) => {
        expect(res.body.message).toEqual('The value for email is already taken.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('blocks a registration if display name is already taken', (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUsers[0].avatar,
        display_name: testUsers[0].display_name,
        email: 'random@email.com',
        password: testUsers[0].password,
      })
      .end((err, res: Response) => {
        expect(res.body.message).toEqual('The value for display name is already taken.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  it('logs in a user', (done) => {
    const testUsers = testUtils.localTestUsers;

    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: testUsers[0].email,
        password: testUsers[0].password,
      })
      .end((err, res: Response) => {
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('user');

        const userData = res.body.user;
        const baseFields = UserModel.getReturnFields();

        baseFields.forEach((field) => {
          expect(userData).toHaveProperty(field);
        });

        expect(userData.email).toEqual(testUsers[0].email);
        expect(userData.display_name).toEqual(testUsers[0].display_name);

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
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
        expect(res.body).toHaveProperty('user');

        const userData = res.body.user;
        const baseFields = UserModel.getReturnFields();

        baseFields.forEach((field) => {
          expect(userData).toHaveProperty(field);
        });
        expect(userData.display_name).toEqual(socialTestUsers[0].display_name);
        expect(userData.strategy).toEqual(socialTestUsers[0].strategy);

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
        const cookies = testUtils.resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
        expect(res.body).toHaveProperty('user');

        const userData = res.body.user;
        const baseFields = UserModel.getReturnFields();

        baseFields.forEach((field) => {
          expect(userData).toHaveProperty(field);
        });

        expect(userData.display_name).toEqual(payload.display_name);

        // tslint:disable-next-line:no-object-literal-type-assertion
        newUsers.push({
          ...newUsers[0],
          id: userData.id,
        } as UserModel);

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

  // afterAll(async (done) => {
  //   await UserModel.emptyTable();
  //   await UserModel
  //     .query()
  //     .insert(testUsers as UserModel[]);
  //
  //   done();
  //
  //   done();
  // });
});
