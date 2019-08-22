import {
  default as request,
  Response,
  SuperTest,
} from 'supertest';
import { generate as idGenerator } from 'shortid';

import { AuthStrategies } from '~lib/types';
import { UserJobs } from '../api/jobs.model';
import { UserModel } from '../api/user.model';
import { TokenModel } from '../api/token/model';
import { configs } from '~config';
import { constants } from '~constants';

const {
  API_ROOT,
  COOKIE_AUTH_KEY_NAME,
} = configs;
const {
  HEADER_NAME_FOR_ACCESS_TOKEN: authHeaderName,
  HEADER_NAME_FOR_CSRF_TOKEN: csrfHeaderName,
} = constants;

class TestUtils {
  public get localTestUsers(): UserModel[] {
    return this.users.filter((user) => {
      return user.strategy === AuthStrategies.local;
    });
  }

  public get socialTestUser(): UserModel[] {
    return this.users.filter((user) => {
      return user.strategy !== AuthStrategies.local;
    });
  }

  public imgData: string;
  public idGenerator: () => string;
  public mockedToken: string;
  public newUsers: UserModel[];
  public users: UserModel[];

  constructor() {
    // tslint:disable-next-line:max-line-length
    this.imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
    this.idGenerator = idGenerator;
    this.mockedToken = 'kfjaahsdlkfjhavlasdjfbnalsdfa';
    this.newUsers = this.generateUsers(3);
    this.users = [
      ...this.generateUsers(
        3,
        AuthStrategies.local,
      ),
      ...this.generateUsers(
        3,
        AuthStrategies.google,
      ),
    ];
  }

  public async emptyTables(): Promise<any> {
    return [
      await TokenModel.emptyTable(),
      await UserJobs.emptyTable(),
      await UserModel.emptyTable(),
    ];
  }

  public async insertUsers(
    users: UserModel[] = this.users,
  ): Promise<UserModel[]> {
    const _users = await UserModel.registerNewUsers(users);
    this.users = _users.map((user, index) => {
      // tslint:disable-next-line:no-object-literal-type-assertion
      return {
        ...user,
        password: users[index].password,
      } as UserModel;
    });
    return this.users;
  }

  public resCookieParser(
    cookieString: string[],
  ): object {
    if (!cookieString || cookieString.length < 1) {
      return {};
    }

    return cookieString
      .reduce(
        (acc, curr) => {
          const payload = curr.split(';')[0];
          const cookiePair = payload && payload.split('=');

          return {
            ...acc,
            ...(payload && cookiePair && {
              [cookiePair[0]]: cookiePair[1],
            }),
          };
        },
        {},
      );
  }

  public generateUser(
    strategy: AuthStrategies,
  ): object {
    return {
      avatar: null,
      display_name: this.idGenerator(),
      id: null,
      ...(strategy === AuthStrategies.local
        ? {
          email: `${this.idGenerator()}@email.com`,
          password: this.idGenerator().slice(0, 7),
        }
        : {
          social_id: this.idGenerator(),
        }),
      strategy,
    };
  }

  public generateUsers(
    count: number = 3,
    strategy: AuthStrategies = AuthStrategies.local,
  ): UserModel[] {
    return [...Array(count)].map(() => {
      return this.generateUser(strategy) as UserModel;
    });
  }

  public getCsrfToken(
    agent: SuperTest<any>,
    endpoint = `${API_ROOT}/token/csrf`,
  ): Promise<{
    agent: SuperTest<any>,
    csrfToken: string,
  }> {
    return new Promise((resolve) => {
      agent
        .get(endpoint)
        .end((err, res: Response) => {
          resolve({
            agent,
            csrfToken: res.header[csrfHeaderName],
          });
        });
    });
  }

  public getAccessToken(
    agent: SuperTest<any>,
    loginCred: {
      email: string,
      password: string,
    },
    endpoint = `${API_ROOT}/auth/local/login`,
  ): Promise<{
    accessToken: string,
    agent: SuperTest<any>,
    response: Response,
  }> {
    return new Promise((resolve) => {
      agent
        .post(endpoint)
        .send(loginCred)
        .end((err, res: Response) => {
          resolve({
            accessToken: res.header[authHeaderName],
            agent,
            response: res,
          });
        });
    });
  }

  public async getLoggedInUser(
    agent: SuperTest<any>,
    loginCred: {
      email: string,
      password: string,
    },
    endpoint = `${API_ROOT}/auth/local/login`,
  ): Promise<{
    accessToken: string,
    agent: SuperTest<any>,
    csrfToken: string,
    response: Response,
  }> {
    const csrfOp = await this.getCsrfToken(agent);
    const loginOp = await this.getAccessToken(
      csrfOp.agent,
      loginCred,
      endpoint,
    );

    return {
      accessToken: loginOp.accessToken,
      agent: loginOp.agent,
      csrfToken: csrfOp.csrfToken,
      response: loginOp.response,
    };
  }

  public requestInfoUpdate(
    agent: SuperTest<any>,
    endpoint: string,
    user_id: string,
    tokens: {
      accessToken: string,
      csrfToken: string,
    },
    newInfo,
  ): Promise<{
    agent: SuperTest<any>,
    response: Response,
  }> {
    return new Promise((resolve) => {
      agent
        .patch(`${endpoint}/${user_id}`)
        .set(csrfHeaderName, tokens.csrfToken)
        .set(authHeaderName, tokens.accessToken)
        .send(newInfo)
        .end((errThree, resThree: request.Response) => {
          resolve({
            agent,
            response: resThree,
          });
        });
    });
  }

  public validateLoginResponse(
    res: Response,
    cookies: string[],
  ): void {
    const _cookies = this.resCookieParser(cookies);

    expect(_cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
    expect(res.header).toHaveProperty(authHeaderName);
    expect(res.body).toHaveProperty('user');
  }

  public validateLoginData(
    res: Response,
    user: any,
  ): void {
    const userData = res.body.user;
    const baseFields = UserModel.getReturnFields();

    baseFields.forEach((field) => {
      expect(userData).toHaveProperty(field);
    });

    expect(userData.display_name).toEqual(user.display_name);
    expect(userData.strategy).toEqual(user.strategy);
  }
}

export const testUtils = new TestUtils();
