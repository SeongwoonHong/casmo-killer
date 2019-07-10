import * as request from 'supertest';

import app from '../../app';

test('ping pongs', (done) => {
  request(app)
    .get('/api/ping')
    .expect(200)
    .end((err, res) => {
      expect(res.body.message).toBe('pong');
      done();
    });
});
