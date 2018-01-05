const Joi = require('joi');

const User = require('../../db/models/user');

const errorHandler = require('../../utils/errorHandler');
const jwt = require('../../utils/jwt');
const mailer = require('../../utils/mailer');
const imgCloud = require('../../utils/imgCloud');

module.exports.logout = (req, res) => {
  res
    .cookie('ckToken', null, {
      maxAge: 0,
      httpOnly: true
    })
    .send();
};

module.exports.verifyLoginStatus = async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .cookie('ckToken', null, {
          maxAge: 0,
          httpOnly: true
        })
        .status(401)
        .send();
    }

    return res.send({
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

module.exports.verifyNewEmail = async (req, res) => {

  const validations = Joi.validate(req.params, Joi.object({
    token: Joi.string().required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  let email = null;

  try {
    ({ email } = await jwt.verify(req.params.token));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // when the token has expired
      return res.status(410).send({
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

};

module.exports.verifyPassword = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    password: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res.status(403).send({
        message: 'Authentication Failed.'
      });
    }

    const verified = await user.verifyPassword(req.body.password);

    if (!verified) {
      return res.status(403).send({
        message: 'Password is incorrect.'
      });
    }

    return res.status(204).send();

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.updateProfile = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    email: Joi.string().email().required(),
    displayName: Joi.string().regex(/^\S*$/).regex(/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/).required(),
    avatar: Joi.string().allow('')
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  const { email, displayName, avatar } = req.body;

  let emailSuccessMsg = null;

  // grabs the user information
  let user = null;

  try {

    user = await User.findUserById(req.user._id);

    if (!user) {
      return res.status(403).send({
        message: 'Authentication Failed'
      });
    }

  } catch (error) {
    return errorHandler.server(res, error);
  }

  // if email's been edited, send out the verification email
  if (email !== user.email) {

    let token = null;

    try {
      token = await jwt.sign({ email }, 'email', '24hrs');
    } catch (error) {
      return errorHandler.server(res, error);
    }

    try {
      const { envelope } = await mailer.verifyEmailUpdate(token, email);
      if (envelope) {
        emailSuccessMsg = `Verification email has been sent to ${envelope.to}. Please click the link in the email to confirm and start using your new email address.`;
        await user.updateTokenInfo({
          forField: 'email',
          tokenValue: token
        });
      }
    } catch (error) {
      return errorHandler.server(res, error);
    }

  }

  if (displayName !== user.displayName) {
    user.displayName = displayName;
  }

  // if avatar's been edited, upload the new image
  if (avatar && avatar !== user.avatar) {
    try {
      user.avatar = await imgCloud.upload(avatar, displayName);
    } catch (error) {
      return errorHandler.server(res, error, 'Failed to upload the profile photo.');
    }
  }

  // save the new user information and re-issue the token
  try {

    const modifiedUser = await user.save();
    const accessToken = await modifiedUser.generateToken();

    return res
      .cookie('ckToken', accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
      })
      .send({
        user: {
          strategy: modifiedUser.strategy,
          _id: modifiedUser._id,
          email: modifiedUser.email,
          displayName: modifiedUser.displayName,
          avatar: modifiedUser.avatar
        },
        successMsg: 'Your profile has been successfully updated.',
        emailSuccessMsg
      });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.updatePassword = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    newPassword: Joi.string().required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  // grabs the user information
  let user = null;

  try {

    user = await User.findUserById(req.user._id);

    if (!user) {
      return res.status(403).send({
        message: 'Authentication Failed.'
      });
    }

    user.password = req.body.newPassword;

  } catch (error) {
    return errorHandler.server(res, error);
  }

  try {

    const modifiedUser = await user.save();

    if (modifiedUser) {
      return res.status(204).send();
    }

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.updateEmail = async (req, res) => {

  const validations = Joi.validate(req.body, Joi.object({
    token: Joi.string().required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  let email = null;

  try {

    ({ email } = await jwt.verify(req.body.token));

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // when the token has expired
      return res.status(410).send({
        message: 'This verification link has expired.'
      });
    }
    return errorHandler.server(res, error);
  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res.status(403).send({
        message: 'Authentication Failed.'
      });
    }

    if (
      user.tokenInfo &&
      user.tokenInfo.forField !== 'email' &&
      user.tokenInfo.tokenValue !== req.body.token
    ) {
      return res.status(403).send({
        message: 'The link has expired.'
      });
    }

    if (user.email !== email) {

      user.email = email;
      user.tokenInfo.forField = undefined;
      user.tokenInfo.tokenValue = undefined;

      const modifiedUser = await user.save();
      const accessToken = await modifiedUser.generateToken();

      return res
        .cookie('ckToken', accessToken, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
        })
        .send({
          user: {
            strategy: modifiedUser.strategy,
            _id: modifiedUser._id,
            email: modifiedUser.email,
            displayName: modifiedUser.displayName,
            avatar: modifiedUser.avatar
          }
        });

    }

    return res.status(410).send({
      message: 'The email address has already been updated.'
    });

  } catch (error) {
    return errorHandler.server(res, error);
  }

};

module.exports.deleteAccount = async (req, res) => {
  console.log(req.body);

  const validations = Joi.validate(req.body, Joi.object({
    password: Joi.string().min(6).max(20).required()
  }));

  if (validations.error) {
    return errorHandler.validation(res, validations.error);
  }

  try {

    const user = await User.findUserById(req.user._id);

    if (!user) {
      return res.status(403).send({
        message: 'Authentication Failed.'
      });
    }

    const verified = await user.verifyPassword(req.body.password);

    if (!verified) {
      return res.status(403).send({
        message: 'Password is incorrect.'
      });
    }

    const deletedUser = await user.remove();

    if (deletedUser.email === user.email) {
      return res.status(204).send();
    }

  } catch (error) {
    return errorHandler.server(res, error);
  }

};
