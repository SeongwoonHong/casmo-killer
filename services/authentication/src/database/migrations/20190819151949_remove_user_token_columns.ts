import * as Knex from 'knex';

import { configs } from '../../config';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('users', (table: Knex.CreateTableBuilder) => {
      table.dropColumn('token_field');
      table.dropColumn('token_value');
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('users', (table: Knex.CreateTableBuilder) => {
      table.enu('token_field', configs.TOKEN_TARGET_FIELDS);
      table.string('token_value');
    });
}
