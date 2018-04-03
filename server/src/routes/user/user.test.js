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

describe('PUT /api/user/update/pass', () => {

  // agent
  //   .put('/api/user/update/password')
  //   .send({ newPassword: 'randomTestPassword' })

});
