import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
import validatePost from './validatePost';
import renderError from './renderError';

class PostInputForm extends Component {
  componentWillMount() {
    this.props.initialize({
      title: this.props.title,
      contents: this.props.contents
    });
  }

  render() {
    const { handleSubmit, submitting, postProp } = this.props;

    const editCancel = (
      <button
        onClick={this.props.toggleEdit}
        type="button"
        className="btn btn-primary"
      >
        Cancel
      </button>
    );
    const postCancel = (
      <Link
        to={this.props.formType === 'edit' ? '' : this.props.cancelUrl}
        className="btn btn-error"
      >
        Cancel
      </Link>
    );
    return (
      <div className="card">
        <div className="card-content">
          { renderError(postProp) }
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
              {this.props.formType === 'edit' ? editCancel : postCancel}
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
