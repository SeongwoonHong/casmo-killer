const Joi = require('joi');

const User = require('../../db/models/user');

const {
  cookieKeyName: cookieKeyName
} = process.env;

const errorUtils = require('../../utils/errorUtils');
const jwt = require('../../utils/jwtUtils');

const { sendEmail, generateMessage } = require('../../utils/mailUtils');

const imgCloud = require('../../utils/imgCloud');
const socialAuth = require('../../utils/socialAuth');

module.exports.requestVerification = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { email } = req.body;

  let token = null;

  try {
    token = await jwt.sign({ email }, 'email', '24hrs');
  } catch (error) {
    return errorUtils.server(res, error);
  }

  try {

    const to = await sendEmail(token, email, 'Welcome to Damso! Confirm Your Email Address', generateMessage({
      action: 'Confirm',
      target: 'email address',
      url: `user/register/${token}`
    }));

    return res.send({
      message: `Verification email has been sent to ${to}. Please click the link in the email to complete your registration.`
    });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.requestPwdReset = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { email } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (!user) {
      return errorUtils.noUser(res);
    }

    if (user.strategy !== 'local') {
      return res.status(403).send({
        message: 'This email is registered with one of social network providers (Facebook, Google, and Kakao). Please visit one of the social network providers to change the password.'
      });
    }

    const token = await jwt.sign({ email }, 'email', '24hrs');

    const to = await sendEmail(token, email, 'Reset Your Damso Password', generateMessage({
      action: 'Reset',
      target: 'password',
      url: `user/reset/${token}`
    }));

    if (to) {

      const tokenUpdated = await user.updateTokenInfo({
        forField: 'password',
        tokenValue: token
      });

      if (tokenUpdated.ok === 1) {
        return res.send({
          message: `The email has been sent to ${to}. Please click the link in the email to reset your password.`
        });
      }

    }

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.verifyToken = async (req, res) => {

  const validations = Joi.validate(req.params, Joi.object({
    token: Joi.string().required(),
    type: Joi.string().valid(['register', 'reset'])
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  // decode the token to get the user's email
  let email = null;

  try {

    ({ email } = await jwt.verify(req.params.token));

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // when the token has expired
      return errorUtils.expiredToken(res);
    }
    return errorUtils.server(res, error);
  }

  let user = null;

  try {
    user = await User.findUserByEmail(email);
  } catch (error) {
    return errorUtils.server(res, error);
  }

  // if verifying the token for new user registration
  if (req.params.type === 'register' && user !== null) {
    return errorUtils.takenEmail(res);
  }

  // if verifying to change an existing user's email address
  if (req.params.type === 'reset') {

    if (!user) {
      return errorUtils.noUser(res);
    }

    if (
      user.tokenInfo.forField !== 'password' &&
      user.tokenInfo.tokenValue !== req.params.token
    ) {
      // TODO: may need a different error message than this one
      return errorUtils.expiredToken(res);
    }

  }

  return res.send({ email });

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

    // this is when the user is logged and and wants to update the email address
    if (req.user && user && user._id.equals(req.user._id)) {
      return res.send({ isDuplicate: false });
    }

    return res.send({ isDuplicate: !!user });

  } catch (error) {
    return errorUtils.server(res, error);
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

    // this is when the user is logged and and wants to update the displayName
    if (req.user && user && user._id.equals(req.user._id)) {
      return res.send({ isDuplicate: false });
    }

    res.send({ isDuplicate: !!user });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.localLogin = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { email, password } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (!user) {
      return errorUtils.noUser(res);
    }

    const {
      strategy, _id, displayName, avatar, bookmarked
    } = user;

    // if the email is registered with a social authentication
    // let the user know which provider it's registered with
    if (strategy !== 'local') {
      const provider = strategy[0].toUpperCase() + strategy.substr(1, strategy.length - 1);
      return res.status(403).send({
        message: `Your email is already registered with ${provider}.`
      });
    }

    // verify the password
    const verified = await user.verifyPassword(password);

    if (!verified) {
      return errorUtils.wrongPwd(res);
    }

    const accessToken = await user.generateToken();

    return res
      .cookie(cookieKeyName, accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
      .send({
        user: {
          strategy,
          _id,
          email,
          displayName,
          avatar,
          bookmarked
        }
      });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.localRegister = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    strategy: Joi.string().valid('local'),
    email: Joi.string().email().required(),
    displayName: Joi.string().regex(/^\S*$/).regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/).required(),
    avatar: Joi.string().allow(''),
    password: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { avatar } = req.body;

  try {

    // save the new user to the database
    let user = await User.registerNewUser(Object.assign({}, req.body, {
      avatar: null
    }));

    if (user && avatar) {

      user.avatar = await imgCloud.upload(avatar, user._id);
      user = await user.save();

    }

    const accessToken = await user.generateToken();

    return res
      .cookie(cookieKeyName, accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: user.strategy,
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          bookmarked: user.bookmarked
        }
      });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.socialLogin = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    provider: Joi.string().required(),
    accessToken: Joi.string().required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  // retrieves the user's profile using the provider's api
  let socialProfile = null;

  try {
    const { provider, accessToken } = req.body;
    socialProfile = await socialAuth[provider](accessToken);
  } catch (error) {
    return errorUtils.server(res, error, 'Failed to retrieve your social profile.');
  }

  // check if the email registered with the social network already exists in database
  try {

    const emailDup = await User.findUserByEmail(socialProfile.email);

    // if an account already exists with the same email address,
    // but with different social network profile, let the user know
    // about the unavailability of the email address.
    if (emailDup) {
      if (
        emailDup.strategy !== socialProfile.strategy &&
        emailDup.socialId !== socialProfile.socialId
      ) {
        return errorUtils.takenEmail(res);

        // if the social network profile as well as the email matches, log the user in
      } else if (
        emailDup.strategy === socialProfile.strategy &&
        emailDup.socialId === socialProfile.socialId
      ) {

        const accessToken = await emailDup.generateToken();

        return res
          .cookie(cookieKeyName, accessToken, {
            httpOnly: true,
            signed: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
          })
          .send({
            user: {
              strategy: emailDup.strategy,
              _id: emailDup._id,
              email: emailDup.email,
              displayName: emailDup.displayName,
              avatar: emailDup.avatar,
              bookmarked: emailDup.bookmarked
            }
          });
      }
    }

  } catch (error) {
    console.log(error);
    return errorUtils.server(res, error);
  }

  // if email search has failed, try searching with socialProfile
  try {

    let socialUser = await User.findUserBySocialProfile(socialProfile.strategy, socialProfile.socialId);

    // if there is no user with the same social profile and email address,
    // redirect the user to the registration form instead of logging in
    if (!socialUser) {
      return res.send({
        shouldRegister: true,
        profile: {
          strategy: socialProfile.strategy,
          email: socialProfile.email,
          displayName: socialProfile.displayName,
          avatar: socialProfile.avatar,
          socialId: socialProfile.socialId,
          socialToken: socialProfile.socialToken,
          bookmarked: socialProfile.bookmarked
        }
      });
    }

    if (socialUser.email !== socialProfile.email) {
      socialUser = await socialUser.updateEmail(socialProfile.email);
    }

    // log the user in
    const accessToken = await socialUser.generateToken();

    return res
      .cookie(cookieKeyName, accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: socialUser.strategy,
          _id: socialUser._id,
          email: socialUser.email,
          displayName: socialUser.displayName,
          avatar: socialUser.avatar,
          bookmarked: socialUser.bookmarked
        }
      });

  } catch (error) {
    return errorUtils.server(res, error);
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
    return errorUtils.validation(res, validations.error);
  }

  // make another call to the social apis to make sure that their social information hasn't been compromised in the client and still matches what the api returns
  try {

    const {
      strategy, email, socialId, socialToken
    } = req.body;

    const profile = await socialAuth[strategy](socialToken);

    if (profile.socialId !== socialId || profile.email !== email) {
      return res.status(400).send({
        message: 'Incorrect social profile information provided. Please try again or contact your social network provider.'
      });
    }

  } catch (error) {
    return errorUtils.server(res, error, 'Failed to retrieve your social profile.');
  }

  const { avatar } = req.body;

  try {

    // save the new user to the database
    let user = await User.registerNewUser(Object.assign({}, req.body, {
      avatar: null,
      socialToken: null
    }));

    if (user && avatar) {

      user.avatar = await imgCloud.upload(avatar, user._id);
      user = await user.save();

    }

    const accessToken = await user.generateToken();

    return res
      .cookie(cookieKeyName, accessToken, {
        httpOnly: true,
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: user.strategy,
          _id: user._id,
          email: user.email,
          displayName: user.displayName,
          avatar: user.avatar,
          bookmarked: user.bookmarked
        }
      });

  } catch (error) {
    return errorUtils.server(res, error);
  }

};

module.exports.resetPassword = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorUtils.validation(res, validations.error);
  }

  const { email, newPassword } = req.body;

  try {

    const user = await User.findUserByEmail(email);

    if (!user) {
      return errorUtils.noUser(res);
    }

    const isPwdSame = await user.verifyPassword(newPassword);

    if (isPwdSame) {
      return res.status(403).send({
        message: 'New password must be different from current password.'
      });
    }

    if (user.checkPrevPwd(req.body.newPassword)) {
      return res.status(403).send({
        message: 'New password must be different from previously used passwords.'
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
    return errorUtils.server(res, error);
  }

};
