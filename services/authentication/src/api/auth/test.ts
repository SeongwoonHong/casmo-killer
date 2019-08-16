jest.mock('~lib/aws');
jest.mock('~lib/mailer');
jest.mock('~lib/token-utils');
jest.mock('~lib/social-auth');

import * as request from 'supertest';

import { App } from '../../app';
import { UserModel } from '../user.model';
import { aws } from '~lib/aws';
import { configs } from '~config';
import { mailer } from '~lib/mailer';
import {
  imgData,
  mockedToken,
  newUsers as _newUsers,
  resCookieParser,
  socialTestUsers,
  testUsers,
} from '~lib/test-utils';
import { sign } from '~lib/token-utils';
import { socialAuth } from '~lib/social-auth';

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
  const newUsers = _newUsers.slice();

  let csrfSecret;

  it('receives csrf token and secret in the response', (done) => {
    agent
      .post(`${endpoint}/initialize`)
      .end(async (err, res: request.Response) => {
        const cookies = resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_CSRF_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_CSRF_HEADER_NAME);

        csrfSecret = res.header[COOKIE_CSRF_HEADER_NAME];

        done();
      });
  });

  it('sends out a confirmation email before registering', (done) => {
    agent
      .post(`${endpoint}/local/request`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        email: newUsers[0].email,
        redirect_url: 'https://localhost:3000/register/<email>',
      })
      .end((err, res: request.Response) => {
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
    agent
      .post(`${endpoint}/local/request`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        email: testUsers[0].email,
        redirect_url: '<email>',
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
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        display_name: newUsers[0].display_name,
        email: newUsers[0].email,
        password: newUsers[0].password,
      })
      .end((err, res: request.Response) => {
        const cookies = resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);

        const allFields = Object.keys(res.body);

        expect(allFields).toContain('id');
        expect(allFields.indexOf('password')).toEqual(-1);
        expect(allFields).toContain('created_at');
        expect(res.body.email).toBe(newUsers[0].email);
        expect(res.body.display_name).toBe(newUsers[0].display_name);

        newUsers[0].id = res.body.id;

        done();
      });
  });

  it('registers a new user with avatar url', (done) => {
    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: 'http://www.silverbulletlabs.com/sitebuilder/images/Remington2-469x473.jpg',
        display_name: newUsers[1].display_name,
        email: newUsers[1].email,
        password: newUsers[1].password,
      })
      .end((err, res: request.Response) => {
        expect(aws.uploadImageData).not.toHaveBeenCalled();
        expect(aws.uploadImageFromUrl).toHaveBeenCalledWith(
          res.body.id,
          'http://www.silverbulletlabs.com/sitebuilder/images/Remington2-469x473.jpg',
        );
        newUsers[1].id = res.body.id;

        done();
      });
  });

  it('registers a new user with avatar data', (done) => {
    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: imgData,
        display_name: newUsers[2].display_name,
        email: newUsers[2].email,
        password: newUsers[2].password,
      })
      .end((err, res: request.Response) => {
        expect(aws.uploadImageData).toHaveBeenCalledWith(
          res.body.id,
          imgData,
        );
        expect(aws.uploadImageFromUrl).not.toHaveBeenCalled();
        expect(true).toBeTruthy();
        newUsers[2].id = res.body.id;

        done();
      });
  });

  it('blocks a registration if email is already taken', (done) => {
    agent
      .post(`${endpoint}/local/register`)
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
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
      .set(COOKIE_CSRF_HEADER_NAME, csrfSecret)
      .send({
        avatar: testUsers[0].avatar,
        display_name: testUsers[0].display_name,
        email: 'random@email.com',
        password: testUsers[0].password,
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
        const cookies = resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toEqual(testUsers[0].email);
        expect(res.body.display_name).toEqual(testUsers[0].display_name);

        done();
      });
  });

  it('blocks a login with an unauthorized email', (done) => {
    agent
      .post(`${endpoint}/local/login`)
      .send({
        email: 'utjw823787@email.com',
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
      .end((err, res: request.Response) => {
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
      .end((err, res: request.Response) => {
        const cookies = resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('avatar');
        expect(res.body.display_name).toEqual(socialTestUsers[0].display_name);
        expect(res.body.social_id).toEqual(socialTestUsers[0].social_id);
        expect(res.body.strategy).toEqual(socialTestUsers[0].strategy);

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
      .end((err, res: request.Response) => {
        const cookies = resCookieParser(res.header['set-cookie']);

        expect(cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
        expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);

        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('avatar');
        expect(res.body.display_name).toEqual(payload.display_name);

        newUsers.push({
          ...newUsers[0],
          id: res.body.id,
        });

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
      .end((err, res: request.Response) => {
        expect(res.body.message).toEqual('Incorrect social profile information provided.');
        expect(res.body.success).toBe(false);

        done();
      });
  });

  afterAll(async (done) => {
    const idsToDelete = newUsers.reduce(
      (acc, curr) => {
        return curr.id
          ? acc.concat(curr.id)
          : acc;
      },
      [],
    );

    await UserModel
      .query()
      .delete()
      .whereIn('id', idsToDelete);

    done();
  });
});
