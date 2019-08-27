import * as Knex from 'knex';

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
      table.enu('token_field', ['email', 'password']);
      table.string('token_value');
    });
}
