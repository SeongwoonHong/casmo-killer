const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

const app = require('../../../app');

chai.use(chaiHttp);

describe('POST /request/verification', () => {

  // it('should send out a verification email to a given email address', () => {
  //
  //   chai
  //     .request(app)
  //     .post('/request/verification')
  //     .send({
  //       'email': 'ckboardtoronto@gmail.com'
  //     });
  //
  // });

  it('should reject an invalid email address', (done) => {

    chai
    .request(app)
    .post('/api/auth/request/verification')
    .send({
      'email': 'shitshit'
    })
    .end(function (err, res) {
      // expect(err).to.be.null;
      expect(err).to.have.status(400);
      done();
    });

  });

});
