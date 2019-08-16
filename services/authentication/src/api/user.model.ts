import * as uuid from 'uuid';
import { RelationMappings } from 'objection';
import { Response } from 'express';

import {
  AuthStrategies, QueryParamsObject,
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
import { success } from '~lib/responses';

const {
  COOKIE_AUTH_HEADER_NAME: headerName,
  COOKIE_AUTH_KEY_NAME : keyName,
  COOKIE_OPTIONS: cookieOptions,
  TOKEN_EXPIRY_FOR_ACCESS: accessTokenExpiry,
  TOKEN_EXPIRY_FOR_REFRESH: refreshTokenExpiry,
} = configs;

export class UserModel extends BaseModel {
  static get AVAILABLE_FIELDS(): string[] {
    return [
      'created_at',
      'deleted_at',
      'email_updated_at',
      'social_id',
      'strategy',
      'updated_at',
    ];
  }

  static get BASE_FIELDS(): string[] {
    return [
      'id',
      'avatar',
      'email',
      'display_name',
    ];
  }

  static get PRIVATE_FIELDS(): string[] {
    return [
      'password',
      'prev_passwords',
      'token_field',
      'token_value',
    ];
  }

  static get tableName(): string {
    return 'users';
  }

  static get relationMappings(): RelationMappings {
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
    fields: string[] = [],
  ): Promise<UserModel> {
    const return_fields = Array.from(
      new Set([
        ...UserModel.BASE_FIELDS,
        ...fields,
      ]),
    );

    return UserModel
      .query()
      .findOne({
        email,
      })
      .column(return_fields);
  }

  public static findBySocialProfile(
    strategy: SocialAuthProviders,
    social_id: string,
  ): Promise<UserModel> {
    return UserModel
      .query()
      .where('strategy', strategy)
      .where('social_id', social_id)
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
        uuid: uuid.v4(),
      },
      'user_id',
      refreshTokenExpiry,
    );
  }

  public static async registerNewUser(
    data,
    fieldOptions: QueryParamsObject,
  ): Promise<UserModel> {
    const {
      exclude_fields = [],
      return_fields = [],
    } = fieldOptions;
    const returnFields = Array.from(
      new Set([
        ...UserModel.BASE_FIELDS,
        ...return_fields.filter((return_field) => {
          return UserModel.ALL_FIELDS.includes(return_field)
            && !exclude_fields.includes(return_field);
        }),
      ]),
    );
    const id = uuid.v4();
    const userData = {
      ...data,
      id,
      ...(data.avatar && {
        avatar: isUrl(data.avatar)
          ? await aws.uploadImageFromUrl(id, data.avatar)
          : await aws.uploadImageData(id, data.avatar),
      }),
    };

    return UserModel
      .query()
      .insert(userData)
      .pick(returnFields)
      .first();
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
    options: {
      access_token?: boolean,
      refresh_token?: boolean,
    } = {},
  ): Promise<{
    access_token: string,
    refresh_token: string,
  }> {
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

  public async logIn(
    res: Response,
    tokens: {
      access_token?: string,
      refresh_token?: string,
    } = {},
    handler = success,
  ): Promise<Response> {
    const {
      access_token,
      refresh_token,
    } = tokens.access_token && tokens.refresh_token
      ? tokens
      : await this.generateTokens();

    res
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

    const user = Object
      .keys(this)
      .reduce(
        (acc, key) => ({
          ...acc,
          ...(!UserModel.PRIVATE_FIELDS.includes(key) && {
            [key]: this[key],
          }),
        }),
        {},
      );

    return handler(
      res,
      user,
    );
  }

  public updateEmail(email: string): Promise<UserModel> {
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
