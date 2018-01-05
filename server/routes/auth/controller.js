const Joi = require('joi');

const User = require('../../db/models/user');

const errorHandler = require('../../utils/errorHandler');
const jwt = require('../../utils/jwt');
const mailer = require('../../utils/mailer');
const imgCloud = require('../../utils/imgCloud');
const socialAuth = require('../../utils/socialAuth');

module.exports.requestVerification = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  const { email } = req.body;

  let token = null;

  try {
    token = await jwt.sign({ email }, 'email', '24hrs');
  } catch (error) {
    return errorHandler.server(res, error);
  }

  try {
    const { envelope } = await mailer.verifyNewEmail(token, email);
    return res.send({
      message: `Verification email has been sent to ${envelope.to}`
    });
  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.verifyToken = async (req, res) => {

  const validations = Joi.validate(req.params, Joi.object({
    token: Joi.string().required(),
    type: Joi.string().valid(['register', 'reset'])
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  if (req.params.type === 'register') {

    let email = null;

    try {
      ({ email } = await jwt.verify(req.params.token));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // when the token has expired
        return res.status(401).send({
          message: 'This verification link has expired.'
        });
      }
      return errorHandler.server(res, error);
    }

    // still need to check if the email address is already taken
    // because the user might click the verification link after
    // the account is created for that email address.
    try {

      const dupUser = await User.findUserByEmail(email);

      if (dupUser) {
        return res.status(403).send({
          message: 'An account has already been created with your email address.'
        });
      }

    } catch (error) {
      return errorHandler.server(res, error);
    }

    return res.send({ email });

  } else if (req.params.type === 'reset') {

    let email = null;

    try {
      ({ email } = await jwt.verify(req.params.token));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // when the token has expired
        return res.status(401).send({
          message: 'This verification link has expired.'
        });
      }
      return errorHandler.server(res, error);
    }

    try {

      const user = await User.findUserByEmail(email);

      if (!user) {
        return res.status(403).send({
          message: 'No account found for this email address.'
        });
      }

      if (user.strategy !== 'local') {
        return res.status(403).send({
          message: 'This email is registered with one of social network providers (Facebook, Google, and Kakao). Please visit one of the social network providers to change the password.'
        });
      }

      if (
        user.tokenInfo.forField !== 'password' &&
        user.tokenInfo.tokenValue !== req.params.token
      ) {
        return res.status(403).send({
          message: 'This verification link has expired.'
        });
      }

    } catch (error) {
      return errorHandler.server(res, error);
    }

    return res.send({ email });

  }

};

module.exports.verifyEmail = async (req, res) => {

  const { email } = req.params;

  if (!email) {
    return res.status(400).send({
      message: 'Please provide email to continue.'
    });
  }

  try {

    const user = await User.findUserByEmail(email);

    // this is when the loggedin user wants to update the email address
    if (req.user && user && user._id.equals(req.user._id)) {
      return res.send({ isDuplicate: false });
    }
    return res.send({ isDuplicate: !!user });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.verifyDisplayName = async (req, res) => {

  const { displayName } = req.params;

  if (!displayName) {
    return res.status(400).send({
      message: 'Please provide display name to continue.'
    });
  }

  try {

    const user = await User.findUserByDisplayName(displayName);

    // this is when the loggedin user wants to update the display name
    if (req.user && user && user._id.equals(req.user._id)) {
      return res.send({ isDuplicate: false });
    }

    res.send({ isDuplicate: !!user });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.localLogin = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  const { email, password } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(403).send({
        message: 'No account found for this email address.'
      });
    }

    const {
      _id, displayName, avatar, strategy
    } = user;

    // if the email is registered with a social account
    if (strategy !== 'local') {
      const provider = strategy[0].toUpperCase() + strategy.substr(1, strategy.length - 1);
      // let the user know which provider the email is registered with
      return res.status(403).send({
        message: `Your email is already registered with ${provider}.`
      });
    }

    // verify the password
    const verified = await user.verifyPassword(password);

    if (!verified) {
      return res.status(403).send({
        message: 'Incorrect email or password.'
      });
    }

    // generate access token and set it to cookie
    const accessToken = await user.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          _id,
          email,
          displayName,
          avatar,
          strategy
        }
      });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.localRegister = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    strategy: Joi.string().required(),
    email: Joi.string().email().required(),
    displayName: Joi.string().regex(/^\S*$/).regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/).required(),
    avatar: Joi.string().allow(''),
    password: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  const { displayName, avatar } = req.body;

  // first upload the avatar image to cloudinary and get the url
  let avatarUrl = null;

  if (avatar) {
    try {
      avatarUrl = await imgCloud.upload(avatar, displayName);
    } catch (error) {
      return errorHandler.server(res, error, 'Failed to upload the profile photo.');
    }
  }

  try {

    // save the new user to the database
    const user = await User.registerNewUser(Object.assign({}, req.body, {
      avatar: avatarUrl
    }));

    console.log(user);

    const accessToken = await user.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: user.strategy,
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar
        }
      });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.socialLogin = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    provider: Joi.string().required(),
    accessToken: Joi.string().required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  // retrieves the user's profile using the provider's api
  let socialProfile = null;

  try {
    const { provider, accessToken } = req.body;
    socialProfile = await socialAuth[provider](accessToken);
  } catch (error) {
    return errorHandler.server(res, error, 'Failed to retrieve your social profile.');
  }

  // check if the email registered with the social network exists in database
  try {

    const emailDup = await User.findUserByEmail(socialProfile.email);

    // if an account already exists with the same email address,
    // but with different social network provider, let the user know
    // about the unavailability of the email address.
    if (emailDup) {
      if (
        emailDup.strategy !== socialProfile.strategy &&
        emailDup.socialId !== socialProfile.socialId
      ) {
        return res.status(403).send({
          message: 'Your email is already registered.'
        });

        // if exactly matching account is found, log the user in
      } else if (
        emailDup.strategy === socialProfile.strategy &&
        emailDup.socialId === socialProfile.socialId
      ) {

        const accessToken = await emailDup.generateToken();

        return res
          .cookie('ckToken', accessToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
          })
          .send({
            user: {
              strategy: emailDup.strategy,
              _id: emailDup._id,
              email: emailDup.email,
              displayName: emailDup.displayName,
              avatar: emailDup.avatar
            }
          });
      }
    }

  } catch (error) {
    return errorHandler.server(res, error);
  }

  // if email search has failed, try searching with socialProfile
  try {

    let socialUser = await User.findUserBySocialProfile(socialProfile.strategy, socialProfile.socialId);

    // if there is no user with the same social profile,
    // redirect to registration form instead of logging in
    if (!socialUser) {
      return res.send({
        shouldRegister: true,
        profile: {
          strategy: socialProfile.strategy,
          email: socialProfile.email,
          displayName: socialProfile.displayName,
          avatar: socialProfile.avatar,
          socialId: socialProfile.socialId,
          socialToken: socialProfile.socialToken
        }
      });
    }

    // user might've updated the email in the social provider's end,
    // if that's the case, we need to update the email address
    // TODO: this is experimental, and may need better error handling
    if (socialUser.email !== socialProfile.email) {
      socialUser = await socialUser.updateEmail(socialProfile.email);
    }

    const accessToken = await socialUser.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: socialUser.strategy,
          _id: socialUser._id,
          email: socialUser.email,
          displayName: socialUser.displayName,
          avatar: socialUser.avatar
        }
      });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.socialRegister = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    strategy: Joi.string().valid(['facebook', 'google', 'kakao']),
    email: Joi.string().email().required(),
    displayName: Joi.string().regex(/^\S*$/).regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/).required(),
    avatar: Joi.string().allow(''),
    socialId: Joi.string().required(),
    socialToken: Joi.string().required(),
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  try {
    const { strategy, socialId, socialToken } = req.body;
    const profile = await socialAuth[strategy](socialToken);
    if (profile.socialId !== socialId) {
      console.log('something is fucked up.');
    } else if (profile.socialId === socialId) {
      console.log('we are all good here.');
    }
  } catch (error) {
    return errorHandler.server(res, error, 'Failed to retrieve your social profile.');
  }

  const { displayName, avatar } = req.body;

  // first upload the avatar image to cloudinary and get the url
  let avatarUrl = null;

  if (avatar) {
    try {
      avatarUrl = await imgCloud.upload(avatar, displayName);
    } catch (error) {
      return errorHandler.server(res, error, 'Failed to upload the profile photo.');
    }
  }

  try {
    // save the new user to the database
    const user = await User.registerNewUser(Object.assign({}, req.body, {
      avatar: avatarUrl,
      socialToken: null
    }));

    const accessToken = await user.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: user.strategy,
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar
        }
      });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.requestPwdReset = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  const { email } = req.body;

  let token = null;

  try {
    token = await jwt.sign({ email }, 'email', '24hrs');
  } catch (error) {
    return errorHandler.server(res, error);
  }

  try {

    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(403).send({
        message: 'No account found for this email address.'
      });
    }

    if (user.strategy !== 'local') {
      return res.status(403).send({
        message: 'This email is registered with one of social network providers (Facebook, Google, and Kakao). Please visit one of the social network providers to change the password.'
      });
    }

    const { envelope } = await mailer.requestPwdReset(token, email);

    await user.updateTokenInfo({
      forField: 'password',
      tokenValue: token
    });

    return res.send({
      message: `Verification email has been sent to ${envelope.to}`
    });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.resetPassword = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  const { email, newPassword } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(403).send({
        message: 'No account found for this email address.'
      });
    }

    const isPwdSame = await user.verifyPassword(newPassword);

    if (isPwdSame) {
      return res.status(403).send({
        message: 'New password must be different from current password.'
      });
    }

    user.password = newPassword;
    user.tokenInfo.forField = undefined;
    user.tokenInfo.tokenValue = undefined;

    const modifiedUser = await user.save();

    if (modifiedUser) {
      return res.send({
        message: 'Your password has been successfully updated.'
      });
    }

  } catch (error) {
    return errorHandler.server(res, error);
  }

};
