const User = require('../db/models/user');

const users = [
  {
    strategy: 'local',
    email: 'ckboardtoronto@gmail.com',
    password: 'ckboardtoronto',
    displayName: 'ckboardtoronto',
    avatar: 'https://this.is.fake.image.com'
  },
  {
    strategy: 'local',
    email: 'ckboardtester@gmail.com',
    password: 'ckboardtester',
    displayName: 'ckboardtester',
    avatar: 'https://this.is.fake.image.com'
  },
  {
    strategy: 'facebook',
    email: 'ckboardsocial@gmail.com',
    password: 'ckboardsocial',
    displayName: 'ckboardsocial',
    avatar: 'https://this.is.fake.image.com'
  }
];

const populateUsers = (done) => {

  User
    .remove({})
    .then(() => {

      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();
      const userThr = new User(users[2]).save();

      return Promise
        .all([userOne, userTwo, userThr])
        .then(() => done());

    });

};

module.exports = { users, populateUsers };
