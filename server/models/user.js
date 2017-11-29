const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema({
  strategy: {
    type: String,
    required: 'Authentication strategy is required.'
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    validate: {
      validator: validator.isEmail,
      message: 'Value provided for user email is not valid'
    }
  },
  password: {
    type: String,
    minlength: 6,
    trim: true,
  },
  username: {
    type: String,
    minlength: 6,
    trim: true,
    unique: true,
    required: 'Username is required'
  },
  avatar: {
    type: String,
    trim: true
  },
  privilege: {
    type: String,
    required: true,
    default: 'newbie'
  }
});

/**
* salt and has the password either when a new user is saved
* or a user record has been modified
* */
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

UserSchema.statics.findUserById = function (token, callback) {

  const User = this;

  User.findOne({ _id: mongoose.Types.ObjectId(token._id) }, callback);

};

UserSchema.statics.findOrCreate = function (profile, callback) {

  const User = this;

  User.findOne({
    strategy: profile.provider,
    email: profile.emails[0].value
  }, (err, user) => {

    if (err) callback(err, null);

    if (user) callback(null, user);

    if (!user) {
      const newUser = new User({
        strategy: profile.provider,
        email: profile.provider !== 'kakao' ? profile.emails[0].value : profile._json.kaccount_email,
        username: profile.username || profile.displayName,
        avatar: profile.provider !== 'kakao' ? profile.photos[0].value : profile._json.properties.profile_image
      });

      newUser
        .save()
        .then((doc) => {
          callback(null, doc);
        })
        .catch((error) => {
          callback(error, null);
        });
    }

  });

};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User
    .findOne({
      strategy: 'local',
      email
    })
    .then((user) => {
      if (!user) {
        return Promise.reject('Incorrect username or password.');
      }
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          console.log(err, res);
          if (res) {
            resolve(user);
          } else {
            reject('Incorrect username or password.');
          }
        });
      });
    });
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
