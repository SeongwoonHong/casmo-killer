import * as request from 'supertest';

import { App } from '../../app';
import { configs } from '~config';

const {
  API_ROOT,
} = configs;

describe('/ping routes', () => {
  const app = new App().express;
  const endpoint = `${API_ROOT}/ping`;

  it('ping pongs', (done) => {
    request(app)
      .get(endpoint)
      .end((err, res) => {
        expect(res.body.message).toBe('pong');
        done();
      });
  });
});
