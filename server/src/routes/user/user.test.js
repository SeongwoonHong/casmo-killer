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

const agent = chai.request.agent(app);

beforeEach((done) => {

  populateUsers(done);

});

beforeEach((done) => {

  agent
    .post('/api/auth/login/local')
    .send({
      email: users[0].email,
      password: users[0].password
    })
    .end(() => {
      done();
    });

});

describe('POST /api/user/logout', () => {

  it('should log the user out', (done) => {

    agent
      .post('/api/user/logout')
      .end((err, res) => {

        expect(res).to.have.status(204);
        expect(res).to.not.have.cookie('ckToken');

        done();

      });

  });

});

describe('GET /api/user/verify/status', () => {

  it('should verify the login status', (done) => {

    const { strategy, email, displayName, avatar } = users[0];

    agent
      .get('/api/user/verify/status')
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body.user).to.deep.include({ strategy, email, displayName, avatar });

        done();

      });

  });

});

describe('POST /api/user/verify/password', () => {

  it('should verify the password for the current user', (done) => {

    agent
      .post('/api/user/verify/password')
      .send({ password: users[0].password })
      .end((err, res) => {

        expect(res).to.have.status(204);

        agent
          .post('/api/user/verify/password')
          .send({ password: users[1].password })
          .end((err, res) => {

            expect(res).to.have.status(401);
            expect(res.body.message).to.equal('Password is incorrect.');

            done();

          });

      });

  });

});

describe('PUT /api/user/update/password', () => {

  it('should update user\'s password', (done) => {

    agent
      .put('/api/user/update/password')
      .send({ newPassword: 'newTestingRandomPwd' })
      .end((err, res) => {

        expect(res).to.have.status(204);
        done()

      });

  });

  it('should not update the password if it has been used before', (done) => {

    agent
      .put('/api/user/update/password')
      .send({ newPassword: 'newTestingRandomPwd' })
      .end((err, res) => {

        agent
          .put('/api/user/update/password')
          .send({ newPassword: users[0].password })
          .end((err, res) => {

            expect(res).to.have.status(403);
            expect(res.body.message).to.equal('New password must be different from previously used passwords.');

            done()

          });

      });

  });

});

describe('PUT /api/user/update/profile', () => {

  it('should not update user\'s profile if the email has been updated in the last 24 hrs.', (done) => {

    const testData = {
      email: 'randomTesting@email.com',
      displayName: 'randomTesting',
      avatar: 'https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/All-about-puppies--Cesar%E2%80%99s-tips%2C-tricks-and-advice.jpg?itok=bi9xUvwe'
    };

    agent
      .put('/api/user/update/profile')
      .send(testData)
      .end((err, res) => {

        expect(res).to.have.status(403);
        expect(res.body.message).to.equal('You have to wait at least 24 hours before you can change your email address.');

        done();

      });

  });

  it('should update user\'s profile and re-issue a token', (done) => {

    const testData = {
      email: users[0].email,
      displayName: 'randomTesting',
      avatar: 'https://www.cesarsway.com/sites/newcesarsway/files/styles/large_article_preview/public/All-about-puppies--Cesar%E2%80%99s-tips%2C-tricks-and-advice.jpg?itok=bi9xUvwe'
    };

    agent
      .put('/api/user/update/profile')
      .send(testData)
      .end((err, res) => {
        console.log(res);

        expect(res).to.have.status(200);
        expect(res).to.have.cookie('ckToken');
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

// TODO: this testing may not be possible because email can only be updated ever 24 hrs
describe('PUT /api/user/update/email', () => {});

describe('DELETE /api/user/delete/account', () => {

  it('should delete the local user account', (done) => {

    agent
      .delete('/api/user/delete/account')
      .send({ payload: users[0].password })
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body.message).to.equal(`The account associated with ${users[0].email} has been successfully deleted.`);

        User
          .findUserByEmail(users[0].email)
          .then(user => {
            expect(user).to.be.null;
            done();
          });

      });

  });

  it('should not delete the local user account if password is incorrect', (done) => {

    agent
      .delete('/api/user/delete/account')
      .send({ payload: users[1].password })
      .end((err, res) => {

        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Password is incorrect.');

        User
          .findUserByEmail(users[0].email)
          .then(user => {
            expect(user.email).to.equal(users[0].email);
            done();
          });

      });

  });

});
