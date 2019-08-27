import { RelationMappings } from 'objection';
import { Response } from 'express';
import { v4 } from 'uuid';

import {
  AuthStrategies,
  QueryParamsObject,
  SocialAuthProviders,
  UserInfoRequest,
} from '~lib/types';
import { BaseModel } from './base.model';
import { UserJobs } from './jobs.model';
import { TokenModel } from './token/model';
import { aws } from '~lib/aws';
import {
  compare,
  hash,
} from '~lib/bcrypt';
import { configs } from '~config';
import { constants } from '~constants';
import { generateRandomStr } from '~lib/miscel';
import { isUrl } from '~lib/validations';
import { sign } from '~lib/token-utils';

const {
  COOKIE_AUTH_KEY_NAME : keyName,
  TOKEN_EXPIRY_FOR_ACCESS: accessTokenExpiry,
  TOKEN_EXPIRY_FOR_REFRESH: refreshTokenExpiry,
} = configs;
const {
  COOKIE_OPTIONS: cookieOptions,
  HEADER_NAME_FOR_ACCESS_TOKEN: headerName,
} = constants;

interface LoginResponse {
  response: Response;
  userData: UserModel;
}

interface TokenGenOptions {
  access_token?: boolean;
  refresh_token?: boolean;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
}

export class UserModel extends BaseModel {
  public static get AVAILABLE_FIELDS(): string[] {
    return [
      'created_at',
      'deleted_at',
      'email_updated_at',
      'social_id',
      'updated_at',
    ];
  }

  public static get BASE_FIELDS(): string[] {
    return [
      'id',
      'avatar',
      'email',
      'display_name',
      'strategy',
    ];
  }

  public static get PRIVATE_FIELDS(): string[] {
    return [
      'password',
      'prev_passwords',
      'refresh_tokens',
      'token_field',
      'token_value',
    ];
  }

  public static get tableName(): string {
    return 'users';
  }

  public static get relationMappings(): RelationMappings {
    return {
      jobs: {
        join: {
          from: 'users.id',
          to: 'user_jobs.user_id',
        },
        modelClass: UserJobs,
        relation: BaseModel.HasManyRelation,
      },
      refresh_tokens: {
        join: {
          from: 'users.id',
          to: 'refresh_tokens.user_id',
        },
        modelClass: TokenModel,
        relation: BaseModel.HasManyRelation,
      },
    };
  }

  public static findByEmail(
    email: string,
  ): Promise<UserModel> {
    return UserModel
      .query()
      .findOne({
        email,
      });
  }

  public static findBySocialProfile(
    strategy: SocialAuthProviders,
    social_id: string,
  ): Promise<UserModel> {
    return UserModel
      .query()
      .where('strategy', strategy)
      .where('social_id', social_id)
      .column(UserModel.ALL_FIELDS)
      .first();
  }

  public static generateAccessToken(
    tokenPayload: object,
  ): Promise<string> {
    return sign(
      tokenPayload,
      'user',
      accessTokenExpiry,
    );
  }

  // TODO: might be too blocking and not performant, need to refactor this
  public static async generateJobToken() {
    let code;
    let isTaken = true;

    while (isTaken) {
      code = generateRandomStr();

      ({ isTaken } = await UserJobs.isValueTaken({
        field: 'token',
        value: code,
      }));
    }

    return code;
  }

  public static generateRefreshToken(
    user_id: string,
  ): Promise<string> {
    return sign(
      {
        user_id,
      },
      'user_id',
      refreshTokenExpiry,
    );
  }

  public static getReturnFields(
    options: QueryParamsObject = {},
  ): string[] {
    const {
      exclude_fields = [],
      return_fields = [],
    } = options;
    const returnFields = Array.from(
      new Set([
        ...UserModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return UserModel.ALL_FIELDS.includes(return_field)
            && !exclude_fields.includes(return_field);
        }),
      ]),
    );

    return returnFields.filter((field) => {
      return !exclude_fields.includes(field) &&
        !UserModel.PRIVATE_FIELDS.includes(field);
    });
  }

  public static async refreshTokens(
    userId: string,
    oldToken: string,
  ) {
    const user = await UserModel
      .query()
      .findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const tokenData = await user
      .$relatedQuery<TokenModel>('refresh_tokens')
      .where('refresh_token', oldToken)
      .first();

    if (!tokenData) {
      throw new UserNotFoundError();
    }

    const tokens = await tokenData.refreshUserToken(user);

    if (!tokens) {
      throw new Error();
    }

    return {
      tokens,
      user,
    };
  }

  public static async registerNewUser(
    data: UserModel,
  ): Promise<UserModel> {
    const id = v4();
    const userData = {
      ...data,
      id,
      ...(data.avatar && {
        avatar: await UserModel.uploadAvatar(id, data.avatar),
      }),
    };

    return UserModel
      .query()
      .insert(userData)
      .returning('*')
      .first();
  }

  public static async registerNewUsers(
    users: UserModel[] = [],
  ) {
    return Promise.all(users.map((user) => {
      return UserModel.registerNewUser(user);
    }));
  }

  public static uploadAvatar(
    id: string,
    avatar: string,
  ): Promise<string> {
    return isUrl(avatar)
      ? aws.uploadImageFromUrl(id, avatar)
      : aws.uploadImageData(id, avatar);
  }

  public avatar?: string;
  public display_name: string;
  public email: string;
  public id: string;
  public password?: string;
  public prev_passwords?: string[];
  public strategy: AuthStrategies | SocialAuthProviders;
  public social_id?: string;

  public async $beforeInsert() {
    super.$beforeInsert();

    if (this.strategy === AuthStrategies.local && this.password) {
      this.password = await hash(this.password);
      this.prev_passwords = [];
    }
  }

  public async generateTokens(
    options: TokenGenOptions = {},
  ): Promise<TokenResponse> {
    const tokenPayload = {
      display_name: this.display_name,
      email: this.email,
      id: this.id,
      ...(this.avatar && {
        avatar: this.avatar,
      }),
    };
    const skipAccessToken = options.hasOwnProperty('access_token')
      && !options.access_token;
    const skipRefreshToken = options.hasOwnProperty('refresh_token')
      && !options.refresh_token;

    return {
      ...(!skipAccessToken && {
        access_token: await UserModel.generateAccessToken(tokenPayload),
      }),
      ...(!skipRefreshToken && {
        refresh_token: await UserModel.generateRefreshToken(this.id),
      }),
    };
  }

  public async getLogInData(
    response: Response,
    tokens: TokenResponse = {},
    request: UserInfoRequest,
  ): Promise<LoginResponse> {
    const tokensProvided = tokens.hasOwnProperty('access_token') &&
      tokens.hasOwnProperty('refresh_token');
    const returnFields = UserModel.getReturnFields(request.query);
    const {
      access_token,
      refresh_token,
    } = tokensProvided
      ? tokens
      : await this.generateTokens();

    response
      .cookie(
        keyName,
        refresh_token,
        cookieOptions,
      )
      .setHeader(
        headerName,
        access_token,
      );

    if (!request.refresh_token && !tokensProvided) {
      await TokenModel
        .query()
        .insert({
          refresh_token,
          user_agent: request.user_agent,
          user_id: this.id,
        });
    }

    const userData = Object
      .keys(this)
      .reduce(
        (acc, key) => ({
          ...acc,
          ...(returnFields.includes(key) && {
            [key]: this[key],
          }),
        }),
        {},
      ) as UserModel;

    return {
      response,
      userData,
    };
  }

  public async hasPwdBeenUsed(
    newPwd: string,
  ): Promise<boolean> {
    for (const oldPwd of this.prev_passwords) {
      const isSame = await compare(newPwd, oldPwd);

      if (isSame) {
        return true;
      }
    }

    return false;
  }

  public async updatePassword(
    newPassword: string,
  ): Promise<UserModel> {
    const password = await hash(newPassword);
    const prev_passwords = this.prev_passwords.concat(password);

    return this
      .$query()
      .patchAndFetch({
        ...this,
        password,
        prev_passwords,
      });
  }

  public async verifyPassword(
    password: string,
  ): Promise<boolean> {
    return compare(
      password,
      this.password,
    );
  }
}

export class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message);
  }
}
