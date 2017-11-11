class InputValidator {
  static isEmail(email) {
    const regex = /^\w+([.-]?\w+)*@[A-Za-z0-9]+([.-]?[A-Za-z0-9]+)*(\.\w{2,15})+$/;
    return regex.test(email);
  }

  static isPassword(password) {
    const regex = /^[a-zA-Z0-9~!@#$%^&*()_+,.\]\]\\[/\\]{6,20}$/;
    return regex.test(password);
  }

  static isEmpty(input) {
    return input === null || input.trim() === '';
  }
}

export default InputValidator;
