import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import krStrings from 'react-timeago/lib/language-strings/ko';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import renderField from './renderField';
import renderRichTextEditor from './renderRichTextEditor';
import Tags from '../Tags/Tags';
import validate from './validatePost';
import Button from '../Button/Button';
import './PostInputForm.scss';

const formatter = buildFormatter(krStrings);

class PostInputForm extends Component {
  componentWillMount() {
    if (this.props.formType === 'edit') {
      this.props.initialize({
        title: this.props.title,
        contents: this.props.contents,
        tags: this.props.data.tags
      });
    }
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    let author;
    let date;
    let postNum;
    let authorId;
    let avatar;
    let tags;
    if (this.props.formType === 'edit') {
      ({
        author, date, postNum, authorId, avatar, tags
      } = this.props.data);
    }
    tags = tags || '';
    author = author || {};
    const fieldClass = this.props.formType === 'edit' ? 'active' : '';
    const infoForEdit = (
      [
        <div className="header" key="header">
          <Link to={`/userPage/${authorId}`}><img src={avatar} alt="" className="circle avartar_circle" /></Link>
          <div className="header-info">
            <div className="writer">{author.displayName}</div>
            <div className="created">Created : <TimeAgo date={date} formatter={formatter} /></div>
          </div>
        </div>,
        <div className="title" key="title">
          <div className="info">
            #{ postNum }
          </div>
        </div>
      ]
    );
    return (
      <div className="card post-input-form">
        <div className="card-content">
          { this.props.formType === 'edit' && infoForEdit }
          <form onSubmit={handleSubmit(this.props.validateAndPost)}>
            <Field
              name="title"
              type="text"
              component={renderField}
              label="Title*"
              fieldClass={fieldClass}
            />
            <Field
              name="tags"
              type="text"
              component={Tags}
              label=""
              tags={tags}
              fieldClass={fieldClass}
            />
            <Field
              name="contents"
              component={renderRichTextEditor}
              label="Content*"
              fieldClass={fieldClass}
            />
            <div>
              <Button
                type="submit"
                className="btn btn-primary submit"
                disabled={submitting}
                text="Save"
                animateAtDidMount
                isLink={false}
              />
              {
                this.props.formType === 'edit'
                ?
                  <Button
                    onClick={this.props.toggleEdit}
                    type="button"
                    className="btn btn-primary"
                    text="Cancel"
                    to={
                      this.props.formType === 'edit' && `/article/${this.props.data._id}`}
                    animateAtDidMount
                  />
                :
                  <Button
                    to={this.props.formType === 'edit' ? '' : this.props.cancelUrl}
                    className="btn btn-error"
                    text="Cancel"
                    animateAtDidMount
                  />
              }
            </div>
          </form>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    data: state.posts.activePost.data
  };
}
function mapDispatchToProps(dispatch) {
  return {
    just: () => dispatch()
  };
}
export default reduxForm({
  validate,
  form: 'PostForm'
})(
  connect(mapStateToProps, mapDispatchToProps)(PostInputForm)
);
