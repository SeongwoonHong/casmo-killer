import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
import validatePost from './validatePost';

class PostInputForm extends Component {
  componentWillMount() {
    this.props.initialize({
      title: this.props.title,
      contents: this.props.contents
    });
  }
  renderError(post) {
    if (post && post.error && post.error.message) {
      return (
        <div className="alert alert-danger">
          { post ? post.error.message.title : '' }
        </div>
      );
    }
    return (<span />);
  }

  render() {
    const { handleSubmit, submitting, postProp } = this.props;

    const editCancel = (
      <button
        onClick={this.props.toggleEdit}
        className="btn btn-primary"
      >
        Cancel
      </button>
    );
    const postCancel = (
      <Link
        to={this.props.formName === 'PostEditForm' ? '' : this.props.cancelUrl}
        className="btn btn-error"
      >
        Cancel
      </Link>
    );
    return (
      <div className="card">
        <div className="card-content">
          { this.renderError(postProp) }
          <form onSubmit={handleSubmit(this.props.validateAndPost)}>
            <Field
              name="title"
              type="text"
              component={renderField}
              label="Title*"
            />
            <Field
              name="contents"
              component={renderTextArea}
              label="Content*"
            />
            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                Save
              </button>
              {this.props.formName === 'PostEditForm' ? editCancel : postCancel}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default reduxForm({
  validatePost,
  form: 'PostForm'
})(
  PostInputForm
);
