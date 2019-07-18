import * as uuid from 'uuid';
import { RelationMappings } from 'objection';
import { Response } from 'express';

import { BaseModel } from './base.model';
import {
  DupeValueCheckOption,
  DupeValueCheckResult,
} from '~lib/types';
import { TokenModel } from './token/model';
import { hash } from '~lib/bcrypt';

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

  public static findByEmail(email: string): Promise<UserModel> {
    return UserModel
      .query()
      .findOne({
        email,
      })
      .column(UserModel.BASE_FIELDS);
  }

  public static async isValueTaken(
    options: DupeValueCheckOption | DupeValueCheckOption[],
  ): Promise<DupeValueCheckResult> {
    if (Array.isArray(options)) {
      for (const option of options) {
        const {
          field,
          isTaken,
        } = await UserModel.checkDupeValue(option);

        if (isTaken) {
          return {
            field,
            isTaken,
          };
        }
      }

      return {
        isTaken: false,
      };
    }

    return UserModel.checkDupeValue(options);
  }

  private static checkDupeValue(option: DupeValueCheckOption): Promise<DupeValueCheckResult> {
    const {
      field,
      value,
      exclude = '',
    } = option;

    if (field && value) {
      let query = UserModel
        .query<UserModel>()
        .where(field, value);

      if (exclude) {
        query = query.whereNot(field, exclude);
      }

      return query
        .count()
        .first()
        .then(({ count = 0 }) => {
          return {
            field,
            isTaken: count > 0,
          };
        });
    }

    return Promise.resolve({
      isTaken: false,
    });
  }

  public id: string;
  public password: string;
  public count: number;

  public async $beforeInsert() {
    super.$beforeInsert();
    this.id = uuid.v4();
    this.password = await hash(this.password);
  }

  public logIn(res: Response) {
    // console.log('asdfasdfasdfasdfasdf', this);
  }
}
