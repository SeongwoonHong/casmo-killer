function formValidate(values) {
  let errors = {
    email: '',
    password: '',
    passwordConfirm: '',
    displayName: '',
    verificationCode: '',
  };

  if (!values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Email address is invalid';
  }

  if (!values.password || !values.password.trim()) {
    errors.password = 'Password is required';
  } else if (values.password && values.password.trim().length < 6) {
    errors.password = 'Password must be 6 or more characters';
  }

  if (!values.passwordConfirm || !values.passwordConfirm.trim()) {
    errors.passwordConfirm = 'Password is required';
  }

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = 'Password should match';
  }

  if (!values.displayName || !values.displayName.trim()) {
    errors.displayName = 'Username is required';
  } else if (values.displayName && values.displayName.trim() < 4) {
    errors.displayName = 'Username must be 4 or more characters';
  }

  if (!values.verificationCode || !values.verificationCode.trim()) {
    errors.verificationCode = 'Verification Code is required';
  }
  return errors;
}

export { formValidate };
