import { useState, useEffect } from 'react';

interface IErrors {
  email?: string;
  password?: string;
  displayName?: string;
}

const useForm = (initialValues, validate, callback) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({} as IErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let shouldCallback = true;

    Object.keys(values).forEach((valueKey) => {
      if (errors[valueKey]) {
        shouldCallback = false;
      };
    });
    if (shouldCallback && isSubmitting) {
      callback();
    }

  }, [errors]);

  function handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    setErrors(validate(values));
    setIsSubmitting(true);
  }

  function handleChange(e) {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]: e.target.value,
    }));
  }

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  };
};

export { useForm };
