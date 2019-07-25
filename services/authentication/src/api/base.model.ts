import * as Knex from 'knex';

import { Model } from 'objection';

// tslint:disable-next-line:no-var-requires
// const connection = require('../../knexfile');
import { configs } from '~config';

Model.knex(Knex({
  client: process.env.DB_CLIENT || 'pg',
  connection: configs.DB_CONNECTION,
}));

export class BaseModel extends Model {
  static get ALL_FIELDS(): string[] {
    return Array.from(
      new Set([
        ...this.AVAILABLE_FIELDS || [],
        ...this.BASE_FIELDS || [],
      ]),
    );
  }

  static get AVAILABLE_FIELDS(): string[] {
    return [];
  }

  static get BASE_FIELDS(): string[] {
    return [];
  }

  static get PRIVATE_FIELDS(): string[] {
    return [];
  }

  protected created_at: string;
  protected updated_at: string;

  public $beforeInsert(): void {
    this.created_at = new Date().toISOString();
  }
  public $beforeUpdate(): void {
    this.updated_at = new Date().toISOString();
  }
}
