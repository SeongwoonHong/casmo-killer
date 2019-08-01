import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .createTable('refresh_tokens', (table: Knex.CreateTableBuilder) => {
      table
        .uuid('user_id')
        .index()
        .notNullable()
        .references('users.id')
        .onDelete('cascade');
      table
        .text('refresh_token')
        .notNullable();
      table
        .timestamp('created_at')
        .notNullable();
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .dropTable('refresh_tokens');
}
