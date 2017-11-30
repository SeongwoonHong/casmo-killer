const inputValidator = require('validator');

class InputValidator {

  static isEmail(email) {
    return inputValidator.isEmail(email);
  }

  static isUsername(username) {
    const regex = /^[a-zA-Z0-9]{4,20}/;
    return regex.test(username);
  }

  static isPassword(password) {
    const regex = /^[a-zA-Z0-9~!@#$%^&*()_+,.\]\]\\[/\\]{4,20}$/;
    return regex.test(password);
  }

  static isEmpty(input) {
    return input === null || input.trim() === '';
  }

}

// using module.exports instead of export default
// to be compatible with Node.js code
module.exports = InputValidator;
