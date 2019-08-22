import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex
    .schema
    .createTable('user_jobs', (table: Knex.CreateTableBuilder) => {
      table
        .uuid('id')
        .primary()
        .notNullable();
      table
        .text('user_id');
      table
        .text('job_name')
        .notNullable();
      table
        .text('token')
        .notNullable();
      table
        .timestamp('created_at')
        .notNullable();
      table
        .timestamp('updated_at');
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex
    .schema
    .dropTable('user_jobs');
}
