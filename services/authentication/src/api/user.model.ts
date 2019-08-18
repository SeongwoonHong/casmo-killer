import { RelationMappings } from 'objection';
import { Response } from 'express';
import { v4 } from 'uuid';

import {
  AuthStrategies,
  QueryParamsObject,
  SocialAuthProviders,
} from '~lib/types';
import { BaseModel } from './base.model';
import { TokenModel } from './token/model';
import { aws } from '~lib/aws';
import {
  compare,
  hash,
} from '~lib/bcrypt';
import { configs } from '~config';
import { isUrl } from '~lib/validations';
import { sign } from '~lib/token-utils';

const {
  COOKIE_AUTH_HEADER_NAME: headerName,
  COOKIE_AUTH_KEY_NAME : keyName,
  COOKIE_OPTIONS: cookieOptions,
  TOKEN_EXPIRY_FOR_ACCESS: accessTokenExpiry,
  TOKEN_EXPIRY_FOR_REFRESH: refreshTokenExpiry,
} = configs;

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

  public static generateRefreshToken(
    user_id: string,
  ): Promise<string> {
    return sign(
      {
        user_id,
        uuid: v4(),
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
    return Array.from(
      new Set([
        ...UserModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return UserModel.ALL_FIELDS.includes(return_field)
            && !exclude_fields.includes(return_field);
        }),
      ]),
    );
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

    const tokens = await tokenData.refreshToken(user);

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
  public strategy: AuthStrategies | SocialAuthProviders;
  public social_id?: string;

  public async $beforeInsert() {
    super.$beforeInsert();

    if (this.password) {
      this.password = await hash(this.password);
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
    fieldOptions?: QueryParamsObject,
  ): Promise<LoginResponse> {
    const returnFields = UserModel.getReturnFields(fieldOptions);
    const {
      access_token,
      refresh_token,
    } = tokens.access_token && tokens.refresh_token
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

    await TokenModel
      .query()
      .insert({
        refresh_token,
        user_id: this.id,
      });

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

  public updateEmail(
    email: string,
  ): Promise<UserModel> {
    return UserModel
      .query()
      .findById(this.id)
      .patchAndFetch({
        email,
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
