const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const jwtUtils = require('../../utils/jwtUtils');

const UserSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  strategy: String,
  email: String,
  emailLastUpdated: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    select: false
  },
  // TODO: possibly check to make sure new password isn't one of the previous passwords
  /*
  prevPasswords: [
    {
      type: String
    }
  ],
  */
  displayName: String,
  avatar: String,
  socialId: String,
  tokenInfo: {
    forField: String,
    tokenValue: String
  },
  privilege: {
    type: String,
    default: 'newbie'
  },
  bookmarked: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'board'
  }],
});

UserSchema.statics.findUserById = function (id) {

  return this.findById(id).select('+password');

};

UserSchema.statics.findUserByEmail = function (email) {

  return this.findOne({ email }).select('+password');

};

UserSchema.statics.findUserByDisplayName = function (displayName) {

  return this.findOne({ displayName });

};

UserSchema.statics.findUserBySocialProfile = function (strategy, socialId) {

  return this.findOne({ strategy, socialId });

};

UserSchema.statics.registerNewUser = function (newUserInfo) {

  const newUser = new this(newUserInfo);
  return newUser.save();
};

UserSchema.methods.updateTokenInfo = function (tokenInfo) {
  return this.update({ tokenInfo });
};

UserSchema.methods.updateEmail = function (email) {
  return this.update({ email });
};

UserSchema.methods.verifyPassword = function (password) {

  return bcrypt.compare(password, this.password);

};

UserSchema.methods.generateToken = function () {

  const {
    strategy, _id, email, displayName, avatar
  } = this;

  return jwtUtils.sign({
    user: {
      strategy, _id, email, displayName, avatar
    }
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

UserSchema.pre('save', function (next) {

  const user = this;

  if (user.isModified('email')) {
    user.emailLastUpdated = Date.now();
  }

  next();

});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
