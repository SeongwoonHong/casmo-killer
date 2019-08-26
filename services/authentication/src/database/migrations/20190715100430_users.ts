import * as Knex from 'knex';

import { configs } from '../../config';
import { constants } from '../../constants';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .createTable('users', (table: Knex.CreateTableBuilder) => {
      table
        .uuid('id')
        .primary()
        .notNullable();
      table.string('avatar');
      table
        .string('display_name')
        .unique()
        .notNullable();
      table
        .string('email')
        .unique();
      table.string('password');
      table.specificType('prev_passwords', 'text[]');
      table
        .enu('strategy', constants.AUTH_STRATEGIES)
        .notNullable()
        .defaultTo('local');
      table.string('social_id');
      table.enu('token_field', configs.TOKEN_TARGET_FIELDS);
      table.string('token_value');
      table
        .timestamp('created_at')
        .notNullable()
        .defaultTo(knex.fn.now());
      table.timestamp('deleted_at');
      table.timestamp('email_updated_at');
      table.timestamp('updated_at');
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .dropTable('users');
}
