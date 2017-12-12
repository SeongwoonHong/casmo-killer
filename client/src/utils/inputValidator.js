import inputValidator from 'validator';

class InputValidator {

  static trim(value) {
    return inputValidator.trim(value);
  }

  static isEmpty(input) {
    return inputValidator.isEmpty(input);
  }

  static isEmail(email) {
    return inputValidator.isEmail(email);
  }

  static isPassword(password) {
    const regex = /^[a-zA-Z0-9~!@#$%^&*()_+,.\]\]\\[/\\]{6,30}$/;
    return regex.test(password);
  }

  static isUsername(username) {
    const regex = /^[a-zA-Z0-9]{4,20}/;
    return regex.test(username);
  }

  static isImage(uri) {
    // const regex = /^(data:image\/)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi;
    const regex = /^(data:image\/)([\w/+]+);(charset=[\w-]+|base64).*,(.*)/gi;
    return regex.test(uri);
  }

}

export default InputValidator;
