import * as Knex from 'knex';

import { Model } from 'objection';

import { configs } from '../config';

Model.knex(
  Knex({
    client: process.env.DB_CLIENT || 'pg',
    connection: configs.DB_CONNECTION,
  }),
);

export class BaseModel extends Model {
  public static get ALL_FIELDS(): string[] {
    return Array.from(new Set([...this.AVAILABLE_FIELDS, ...this.BASE_FIELDS]));
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

  public created_at: string;
  public updated_at: string;
  public deleted_at: string;

  public $beforeInsert(): void {
    this.created_at = new Date().toISOString();
  }
  public $beforeUpdate(): void {
    this.updated_at = new Date().toISOString();
  }
  public $beforeDelete(): void {
    this.deleted_at = new Date().toISOString();
  }
}
