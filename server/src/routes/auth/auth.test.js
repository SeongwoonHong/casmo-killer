require('dotenv').config({
  path: require('path').resolve(`./src/env/.env.${process.env.NODE_ENV}`)
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

const jwtUtils = require('../../utils/jwtUtils');

const { users, populateUsers } = require('../../utils/testSeed');

const User = require('../../db/models/user');

const app = require('../../../app');

chai.use(chaiHttp);

beforeEach(populateUsers);

describe('POST /request/verification', () => {

  it('should reject an invalid email address', (done) => {

    chai
      .request(app)
      .post('/api/auth/request/verification')
      .send({
        'email': 'emailaddress.com'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();
      });

  });

  it('should send out a verification email with the token for registration', (done) => {

    chai
      .request(app)
      .post('/api/auth/request/verification')
      .send({
        'email': 'ssinsoo@gmail.com'
      })
      .end((err, res) => {
        expect(res.body).to.deep.equal({
          'message': 'Verification email has been sent to ssinsoo@gmail.com. Please click the link in the email to complete your registration.'
        });
        expect(res).to.have.status(200);
        done();
      });

  });

});

describe('POST /api/auth/request/passwordReset', () => {

  it('should not send out a verification email when the user is not found', (done) => {

    chai
      .request(app)
      .post('/api/auth/request/passwordReset')
      .send({
        'email': 'ssinsoo@email.com'
      })
      .end((err, res) => {

        expect(res).to.have.status(403);
        expect(res.body).to.deep.equal({
          'message': 'No account exists with this email address.'
        });

        done();

      });

  });

  it('should not send out a verification email when the user is not local', (done) => {

    chai
      .request(app)
      .post('/api/auth/request/passwordReset')
      .send({
        'email': users[2].email
      })
      .end((err, res) => {

        expect(res).to.have.status(403);
        expect(res.body).to.deep.equal({
          'message': 'This email is registered with one of social network providers (Facebook, Google, and Kakao). Please visit one of the social network providers to change the password.'
        });

        done();

      });

  });

  it('should send out a verification email with the token for password reset', (done) => {

    chai
      .request(app)
      .post('/api/auth/request/passwordReset')
      .send({
        'email': users[0].email
      })
      .end((err, res) => {

        expect(res.body).to.deep.equal({
          'message': `The email has been sent to ${users[0].email}. Please click the link in the email to reset your password.`
        });

        User
          .find({ email: users[0].email })
          .then(user => {
            expect(user[0].tokenInfo.forField).to.equal('password');
            expect(/^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/.test(user[0].tokenInfo.tokenValue)).to.equal(true);
            expect(user[0].email).to.equal(users[0].email);
            done();
          });


      });

  });

});

describe('GET /api/auth/verify/token', () => {

  it('should detect already taken email and not return a decoded email', (done) => {

    jwtUtils
      .sign({ email: users[0].email }, 'email', '24hrs')
      .then(token => {

        chai
          .request(app)
          .get(`/api/auth/verify/token/register/${token}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.deep.equal({ 'message': 'This email address is already registered.' });
            done();
          });

      });

  });

  it('should verify the given token return the decoded email for registration', (done) => {

    jwtUtils
      .sign({ email: 'ssinsoo@gmail.com' }, 'email', '24hrs')
      .then(token => {

        chai
          .request(app)
          .get(`/api/auth/verify/token/register/${token}`)
          .end((err, res) => {
            expect(res.body).to.deep.equal({ 'email': 'ssinsoo@gmail.com' });
            done();
          });

      });

  });

  it('should not decode the email if the user has never requested password reset', (done) => {

    jwtUtils
      .sign({ email: users[2].email }, 'email', '24hrs')
      .then(token => {

        chai
          .request(app)
          .get(`/api/auth/verify/token/reset/${token}`)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.deep.equal({ 'message': 'This verification link has expired.' });
            done();
          });

      });

  });

  it('should verify the given token return the decoded email for password reset', (done) => {

    let currentUser;
    let currentToken;

    User
      .findUserByEmail(users[1].email)
      .then(user => {
        currentUser = user;
        return jwtUtils.sign({ email: user.email }, 'email', '24hrs');
      })
      .then(token => {

        currentToken = token;

        return currentUser.updateTokenInfo({
          tokenField: 'password',
          tokenValue: token
        });

      })
      .then(() => {

        chai
          .request(app)
          .get(`/api/auth/verify/token/reset/${currentToken}`)
          .end((err, res) => {

            expect(res).to.have.status(200);
            expect(res.body).to.deep.equal({ 'email': users[1].email });

            done();

          });

      });

  });

});

describe('GET /api/auth/verify/email', () => {

  it('should detect if an email address is already registered', (done) => {

    chai
      .request(app)
      .get(`/api/auth/verify/email/${users[0].email}`)
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ isDuplicate: true });

        chai
          .request(app)
          .get('/api/auth/verify/email/random@email.com')
          .end((err, ress) => {

              expect(ress).to.have.status(200);
              expect(ress.body).to.deep.equal({ isDuplicate: false });

              done();

          });

      });

  });

});

describe('GET /api/auth/verify/displayName', () => {

  it('should detect if a displayName is already registered', (done) => {

    chai
      .request(app)
      .get(`/api/auth/verify/displayName/${users[0].displayName}`)
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ isDuplicate: true });

        chai
          .request(app)
          .get('/api/auth/verify/displayName/randomCom')
          .end((err, ress) => {

            expect(ress).to.have.status(200);
            expect(ress.body).to.deep.equal({ isDuplicate: false });

            done();

          });

      });

  });

});

describe('POST /api/auth/login/local', () => {

  it('should log the local user in by setting a cookie', (done) => {

    const {
      email, password, strategy, displayName, avatar
    } = users[0];

    chai
      .request(app)
      .post('/api/auth/login/local')
      .send({ email, password })
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res).to.have.cookie('ckToken');
        expect(res.body.user).to.deep.include({ strategy, email, displayName, avatar });

        done();

      });

  });

  it('should reject the login if the user is not local', (done) => {

    const { email, password } = users[2];

    chai
      .request(app)
      .post('/api/auth/login/local')
      .send({ email, password })
      .end((err, res) => {

        expect(res).to.have.status(403);
        expect(res.body).to.deep.equal({ 'message': `Your email is already registered with Facebook.` });

        done();

      });

  });

});

describe('POST /api/auth/register/local', () => {

  it('should create a new local user and log the user in', (done) => {

    const testData = {
      strategy: 'local',
      email: 'ssinsoo@gmail.com',
      displayName: 'oosniss',
      avatar: 'https://this.is.fake.image.com',
      password: 'testPassWord'
    };

    chai
      .request(app)
      .post('/api/auth/register/local')
      .send(testData)
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res).to.have.cookie('ckToken');

        delete testData.password;

        expect(res.body.user).to.deep.include(testData);

        User
          .findUserByEmail(testData.email)
          .then(user => {
            expect(user).to.deep.include(testData);
            done();
          });

      });

  });

});

// TODO: do this
describe('POST /api/auth/login/social', () => {});

// TODO: do this
describe('POST /api/auth/register/social', () => {});

describe('PUT /api/auth/reset/password', () => {

  it('should not reset the password if the new password is the same as the current one', (done) => {

    chai
      .request(app)
      .put('/api/auth/reset/password')
      .send({
        email: users[0].email,
        newPassword: users[0].password
      })
      .end((err, res) => {

        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('New password must be different from current password.');

        done();

      });

  });

  it('should reset the password for a given user', (done) => {

    chai
      .request(app)
      .put('/api/auth/reset/password')
      .send({
        email: users[0].email,
        newPassword: 'newTestingPassword'
      })
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Your password has been successfully updated.');

        User
          .findUserByEmail(users[0].email)
          .then(user => {
            return user.verifyPassword('newTestingPassword');
          })
          .then(isVerified => {
            expect(isVerified).to.equal(true);
            done();
          });

      });

  });

  it('should not reset the password if the new password has been used before', (done) => {

    chai
      .request(app)
      .put('/api/auth/reset/password')
      .send({
        email: users[0].email,
        newPassword: 'newTestingPassword'
      })
      .end(() => {

        chai
          .request(app)
          .put('/api/auth/reset/password')
          .send({
            email: users[0].email,
            newPassword: users[0].password
          })
          .end((err, res) => {

            expect(res).to.have.status(403);
            expect(res.body.message).to.equal('New password must be different from previously used passwords.');

            done();

          });

      });

  });

});
