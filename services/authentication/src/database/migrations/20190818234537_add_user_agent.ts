import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('refresh_tokens', (table: Knex.CreateTableBuilder) => {
      table.text('user_agent');
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('refresh_tokens', (table: Knex.CreateTableBuilder) => {
      table.dropColumn('user_agent');
    });
}
