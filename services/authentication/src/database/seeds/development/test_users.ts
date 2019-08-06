import * as Knex from 'knex';

export const testUsers = [
  {
    avatar: null,
    created_at: '2019-07-30 18:28:45.901000',
    deleted_at: null,
    display_name: 'tester_one',
    email: 'tester_one@damso.com',
    email_updated_at: null,
    id: '708a0b9e-0c33-4805-9344-ae29963c5051',
    password: '$2b$10$Fmnso/banmZ6wtNs/mwaDuthjJy4HVS9Ro1jGw5GQIMjL6HdZc7oO',
    prev_passwords: null,
    social_id: null,
    strategy: 'local',
    token_field: null,
    token_value: null,
    updated_at: null,
  },
  {
    avatar: null,
    created_at: '2019-07-30 18:29:00.221000',
    deleted_at: null,
    display_name: 'tester_two',
    email: 'tester_two@damso.com',
    email_updated_at: null,
    id: 'c25ebeec-8207-4e5c-aa48-fbff64a198ba',
    password: '$2b$10$LYNLBvhQu2OE/cKXJfhPXudvPA75ZxC8naHqjE1OSosLRqeHG0Nti',
    prev_passwords: null,
    social_id: null,
    strategy: 'local',
    token_field: null,
    token_value: null,
    updated_at: null,
  },
  {
    avatar: null,
    created_at: '2019-07-30 18:29:12.765000',
    deleted_at: null,
    display_name: 'tester_three',
    email: 'tester_three@damso.com',
    email_updated_at: null,
    id: 'ec2cd494-d3c8-484a-aaa3-6e7663e42c16',
    password: '$2b$10$YA3QWRjLlG3kZRZS9C6LTOxv3kgxUEs32hdnwp1XZECawop5pAVC2',
    prev_passwords: null,
    social_id: null,
    strategy: 'local',
    token_field: null,
    token_value: null,
    updated_at: null,
  },
];

export async function seed(knex: Knex): Promise<any> {
  return knex('users')
    .del()
    .then(() => {
      return knex('users').insert(testUsers);
    });
}
