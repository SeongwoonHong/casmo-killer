function formValidate(values) {
  let errors = {
    email: '',
    password: '',
    displayName: '',
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

  if (!values.displayName || !values.displayName.trim()) {
    errors.displayName = 'Username is required';
  } else if (values.displayName && values.displayName.trim() < 4) {
    errors.displayName = 'Username must be 4 or more characters';
  }

  return errors;
}

export { formValidate };
