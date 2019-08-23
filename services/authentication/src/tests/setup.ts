jest.mock('~lib/aws');
jest.mock('~lib/mailer');
jest.mock('~lib/social-auth');

import { testUtils } from '~lib/test-utils';

beforeAll(async (done) => {
  // await testUtils.emptyTables();
  await testUtils.insertUsers();
  done();
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async (done) => {
  await testUtils.emptyTables();
  done();
});
