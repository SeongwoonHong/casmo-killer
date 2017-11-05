import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { postSubmitRequest } from '../../actions/post';

class PostsNew extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }
  /* POST SUBMIT */
  onSubmit(contents) {
    return this.props.postSubmitRequest(contents).then(
      () => {
        if (this.props.postStatus.status === 'SUCCESS') {
          // TRIGGER LOAD NEW POST
          this.loadNewPost().then(
            () => {
              Materialize.toast('Success!', 2000);
            }
          );
        } else {
        /*
            ERROR CODES
                1: NOT LOGGED IN
                2: EMPTY CONTENTS
        */
          let $toastContent;
          switch (this.props.postStatus.error) {
            case 1:
              // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
              $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
              Materialize.toast($toastContent, 2000);
              setTimeout(() => { this.props.match.location.reload(false); }, 2000);
              break;
            case 2:
              $toastContent = $('<span style="color: #FFB4BA">Please write something</span>');
              Materialize.toast($toastContent, 2000);
              break;
            default:
              $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
              Materialize.toast($toastContent, 2000);
              break;
          }
        }
      }
    );
  }
  loadNewPost() {
    this.props.history.push('/community');
  }
  renderField(field) {
    const { meta: { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;
    return (
      <div className={className}>
        <label>{ field.label }</label>
        <input
          className="form-control"
          type="text"
          {...field.input}
        />
        <div className="text-help">
          {touched ? error : ''}
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Field
          label="Title for Post"
          name="title"
          component={this.renderField}
        />
        <Field
          label="Username"
          name="username"
          component={this.renderField}
        />
        <Field
          label="Post Content"
          name="contents"
          component={this.renderField}
        />
        <button type="submit" className="btn btn-primary">Submit</button>
        <Link className="btn btn-danger" to="/community">Cancel</Link>
      </form>
    );
  }
}

function validate(values) {
  // console.log(values) => {title: 'asdf', categories: 'asdf', content: 'asdf'}
  const errors = {};
  // validation the inputs from 'values'
  if (!values.title) {
    errors.title = 'Enter a title';
  }

  if (!values.categories) {
    errors.categories = 'Enter some categories';
  }

  if (!values.content) {
    errors.content = 'Enter some content please';
  }
  // if errors is empty, the form is fine to submit
  // if errors has *any* properties, redux form assumes form is invalid
  return errors;
}

const mapStateToProps = (state) => {
  return {
    postStatus: state.posts.post,
  };
};

export default reduxForm({
  validate,
  form: 'PostsNewForm'
})(
  connect(mapStateToProps, { postSubmitRequest })(PostsNew)
);
