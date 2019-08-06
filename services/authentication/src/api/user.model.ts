import * as uuid from 'uuid';
import { RelationMappings } from 'objection';
import { Response } from 'express';

import { BaseModel } from './base.model';
import { TokenModel } from './token/model';
import {
  compare,
  hash,
} from '~lib/bcrypt';
import { configs } from '~config';
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

  public static generateAccessToken(tokenPayload: object): Promise<string> {
    return sign(
      tokenPayload,
      'user',
      accessTokenExpiry,
    );
  }

  public static generateRefreshToken(user_id: string): Promise<string> {
    return sign(
      {
        user_id,
        uuid: uuid.v4(),
      },
      'user_id',
      refreshTokenExpiry,
    );
  }

  public static async refreshTokens(userId: string, oldToken: string) {
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

  public async $beforeInsert() {
    super.$beforeInsert();
    this.id = uuid.v4();
    this.password = await hash(this.password);
  }

  public async generateTokens(): Promise<{
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

    return {
      access_token: await UserModel.generateAccessToken(tokenPayload),
      refresh_token: await UserModel.generateRefreshToken(this.id),
    };
  }

  public logIn(
    res: Response,
    tokens: {
      access_token: string,
      refresh_token: string,
    },
    handler = success,
  ): Response {
    const {
      access_token,
      refresh_token,
    } = tokens;

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

  public async verifyPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}

export class UserNotFoundError extends Error {
  constructor(message = 'User not found') {
    super(message);
  }
}
