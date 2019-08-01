import * as Knex from 'knex';

import { Model } from 'objection';

import { configs } from '~config';
import { DupeValueCheckOption, DupeValueCheckResult } from '~lib/types';

Model.knex(Knex({
  client: process.env.DB_CLIENT || 'pg',
  connection: configs.DB_CONNECTION,
}));

export class BaseModel extends Model {
  public static get ALL_FIELDS(): string[] {
    return Array.from(
      new Set([
        ...this.AVAILABLE_FIELDS,
        ...this.BASE_FIELDS,
      ]),
    );
  }

  public static get AVAILABLE_FIELDS(): string[] {
    return [];
  }

  public static get BASE_FIELDS(): string[] {
    return [];
  }

  public static get PRIVATE_FIELDS(): string[] {
    return [];
  }

  public static async isValueTaken(
    options: DupeValueCheckOption | DupeValueCheckOption[],
  ): Promise<DupeValueCheckResult> {
    if (Array.isArray(options)) {
      for (const option of options) {
        const {
          field,
          isTaken,
        } = await this.checkDupeValue(option);

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

    return this.checkDupeValue(options);
  }

  private static checkDupeValue(option: DupeValueCheckOption): Promise<DupeValueCheckResult> {
    const {
      field,
      value,
      exclude = '',
    } = option;

    if (field && value) {
      let query = this
        .query()
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

  protected count?: number;
  protected created_at: string;
  protected updated_at: string;

  public $beforeInsert(): void {
    this.created_at = new Date().toISOString();
  }
  public $beforeUpdate(): void {
    this.updated_at = new Date().toISOString();
  }
}
