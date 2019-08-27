import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('user_jobs', (table: Knex.CreateTableBuilder) => {
      table
        .timestamp('expires_at')
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('user_jobs', (table: Knex.CreateTableBuilder) => {
      table.dropColumn('expires_at');
    });
}
