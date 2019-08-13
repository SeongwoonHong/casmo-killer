import * as Knex from 'knex';

exports.up = knex =>
  knex.schema.createTable('posts', (table: Knex.CreateTableBuilder) => {
    table
      .uuid('id')
      .primary()
      .notNullable();
    table.string('title');
    table.text('body');
    table.uuid('user_id');
    table.string('thumnail');
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
    table.timestamp('updated_at');
  });

exports.down = knex => knex.schema.dropTable('posts');
