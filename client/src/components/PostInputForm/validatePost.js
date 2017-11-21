
const validatePost = (values) => {
  const errors = {};

  // validation the inputs from 'values'
  if (!values.title || values.title.trim() === '') {
    errors.title = 'Enter a Title';
  }
  if (!values.contents || values.contents.trim() === '') {
    errors.contents = 'Enter some content';
  }
  // if errors is empty, the form is fine to submit
  // if errors has *any* properties, redux form assumes form is invalid
  return errors;
};

export default validatePost;
