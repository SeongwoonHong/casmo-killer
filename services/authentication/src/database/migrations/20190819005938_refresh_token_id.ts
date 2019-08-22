import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('refresh_tokens', (table: Knex.CreateTableBuilder) => {
      table
        .uuid('id')
        .primary()
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .alterTable('refresh_tokens', (table: Knex.CreateTableBuilder) => {
      table.dropColumn('id');
    });
}
