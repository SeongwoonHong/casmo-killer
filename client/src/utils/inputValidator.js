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
    const regex = /^[a-zA-Z0-9~!@#$%^&*()_+,.\]\]\\[/\\]{6,20}$/;
    return regex.test(password);
  }

  static hasWhiteSpace(string) {
    return /\s/g.test(string);
  }

  static isUsername(username) {
    const regex = /^[a-zA-Z0-9ㄱ-ㅎ가-힣]{4,20}/;
    return regex.test(username);
  }

}

export default InputValidator;
