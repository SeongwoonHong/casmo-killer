const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = require('chai');

const app = require('../../../app');

chai.use(chaiHttp);

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

});
