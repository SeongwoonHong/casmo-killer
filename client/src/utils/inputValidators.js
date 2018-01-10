import inputValidator from 'validator';
import axios from 'axios';

export const trim = (input) => {
  return inputValidator.trim(input);
};

export const validateImg = (img) => {
  return inputValidator.isDataURI(img) || inputValidator.isURL(img);
};

export const validateEmail = async (email) => {

  if (inputValidator.isEmpty(email)) {
    return 'Please enter email address.';
  } else if (/\s/g.test(email)) {
    return 'Email address cannot have any space.';
  } else if (!inputValidator.isEmail(email)) {
    return 'The provided email address is not valid.';
  }

  try {
    const { data } = await axios.get(`/api/auth/verify/email/${email}`);
    if (!data) {
      return 'Internal Server Error.';
    }
    if (data.isDuplicate) {
      return 'The email address is already registered.';
    }
  } catch (error) {
    console.error(error);
    return 'Internal Server Error.';
  }

  return '';

};

export const validateDisplayName = async (displayName) => {

  if (inputValidator.isEmpty(displayName)) {
    return 'Please enter display name.';
  } else if (displayName.length < 4) {
    return 'Display name must be more than 4 characters.';
  } else if (displayName.length > 20) {
    return 'Display name must be less than 20 characters.';
  } else if (/\s/g.test(displayName)) {
    return 'Display name cannot have any space.';
  } else if (!/^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/.test(displayName)) {
    return 'Display name cannot have special characters.';
  }

  try {
    const { data } = await axios.get(`/api/auth/verify/displayName/${displayName}`);
    if (!data) {
      return 'Internal Server Error.';
    }
    if (data.isDuplicate) {
      return 'The display name is already registered.';
    }
  } catch (error) {
    console.error(error);
    return 'Internal Server Error.';
  }

  return '';

};

export const validatePassword = async (password, confirmPassword = null, isReset = false) => {

  // TODO: password may need more robust validation
  if (inputValidator.isEmpty(password)) {
    return 'Please enter password.';
  } else if (password.length < 6) {
    return 'Password must be more than 6 characters.';
  } else if (password.length > 20) {
    return 'Password must be less than 20 characters.';
  } else if (confirmPassword !== null) {
    if (password !== confirmPassword) {
      return 'Password does not match the confirm password.';
    } else if (password === confirmPassword && !isReset) {
      try {
        const { status } = await axios.post('/api/user/verify/password', { password });
        if (status === 204) {
          return 'New password must be different from current password.';
        }
      } catch (error) {
        console.error(error);
      }
    }

  }

  return '';

};
