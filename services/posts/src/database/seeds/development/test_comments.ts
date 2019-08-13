import * as Knex from 'knex';

export const testComments = [
  {
    body: 'test content hahah',
    created_at: '2019-07-30 18:28:45.901000',
    deleted_at: null,
    id: '708a0b9e-0c33-4805-9344-ae29963c5053',
    post_id: '708a0b9e-0c33-4805-9344-ae29963c5052',
    updated_at: null,
    user_id: '708a0b9e-0c33-4805-9344-ae29963c5051',
  },
  {
    body: 'test content 2 hahah',
    created_at: '2019-06-30 18:28:45.901000',
    deleted_at: null,
    id: 'c25ebeec-8207-4e5c-aa48-fbff64a198b3',
    post_id: '708a0b9e-0c33-4805-9344-ae29963c5052',
    updated_at: null,
    user_id: '708a0b9e-0c33-4805-9344-ae29963c5051',
  },
];

export async function seed(knex: Knex): Promise<any> {
  return knex('comments')
    .del()
    .then(() => {
      return knex('comments').insert(testComments);
    });
}
