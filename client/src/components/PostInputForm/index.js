import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
import validate from './validatePost';

class PostInputForm extends Component {
  componentWillMount() {
    if (this.props.formType === 'edit') {
      this.props.initialize({
        title: this.props.title,
        contents: this.props.contents
      });
    }
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    const fieldClass = this.props.formType === 'edit' ? 'active' : '';

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
          <form onSubmit={handleSubmit(this.props.validateAndPost)}>
            <Field
              name="title"
              type="text"
              component={renderField}
              label="Title*"
              fieldClass={fieldClass}
            />
            <Field
              name="contents"
              component={renderTextArea}
              label="Content*"
              fieldClass={fieldClass}
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
  validate,
  form: 'PostForm'
})(
  PostInputForm
);
