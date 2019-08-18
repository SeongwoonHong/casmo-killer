/*import { TokenModel } from '../api/token/model';
import { UserModel } from '../api/user.model';
import { testUsers } from '~lib/test-utils';

afterAll(async (done) => {
  await TokenModel.emptyTable(TokenModel.idColumn);
  await UserModel.emptyTable();
  await UserModel
    .query()
    .insert(testUsers as UserModel[]);

  done();
});*/
// import { shit } from '~lib/test-utils';

beforeEach(() => {
  // console.log(shit);
  jest.clearAllMocks();
});
