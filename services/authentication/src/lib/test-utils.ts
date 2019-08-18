import { Response } from 'supertest';
import { generate } from 'shortid';

import { AuthStrategies } from '~lib/types';
import { UserModel } from '../api/user.model';
import { TokenModel } from '../api/token/model';
import { configs } from '~config';

const {
  COOKIE_AUTH_HEADER_NAME,
  COOKIE_AUTH_KEY_NAME,
} = configs;

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
    this.idGenerator = generate;
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
    await TokenModel.emptyTable();
    await UserModel.emptyTable();
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

  public validateLoginResponse(
    res: Response,
    cookies: string[],
  ): void {
    const _cookies = this.resCookieParser(cookies);

    expect(_cookies).toHaveProperty(COOKIE_AUTH_KEY_NAME);
    expect(res.header).toHaveProperty(COOKIE_AUTH_HEADER_NAME);
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
