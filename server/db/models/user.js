const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const token = require('../../utils/jwtUtils');

const UserSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  strategy: String,
  email: String,
  password: {
    type: String,
    select: false
  },
  username: String,
  avatar: String,
  social: {
    id: String,
    accessToken: String
  },
  privilege: {
    type: String,
    default: 'newbie'
  },
  bookmarked: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'board'
  }],
});

UserSchema.statics.registerSocialUser = function (profile) {

  const newUser = new this(profile);

  return newUser.save();

};

UserSchema.statics.registerLocalUser = function ({ email, password, username, avatar }) {

  const newUser = new this({
    strategy: 'local',
    email,
    password,
    username,
    avatar
  });

  return newUser.save();

};

UserSchema.statics.findUserByEmail = function (email) {

  return this.findOne({ email }).select('+password');

};

UserSchema.statics.findUserByUsername = function (username) {

  return this.findOne({ username }).select('+password');

};

UserSchema.statics.findLocalUser = function (email, password) {

  const User = this;

  return User
    .findOne({
      strategy: 'local',
      email
    })
    .then((user) => {

      if (!user) {
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {

        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });

      });

    });

};

UserSchema.methods.verifyPassword = function (password) {

  return bcrypt.compare(password, this.password);

};

UserSchema.methods.generateToken = function () {

  const { _id, username, avatar } = this;

  return token.sign({
    _id,
    username,
    avatar
  }, 'user');

};

UserSchema.pre('save', function (next) {

  const user = this;

  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err1, salt) => {

      if (err1) throw err1;

      bcrypt.hash(user.password, salt, (err2, hash) => {

        if (err2) throw err2;

        user.password = hash;
        next();

      });

    });

  } else {

    next();

  }

});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
