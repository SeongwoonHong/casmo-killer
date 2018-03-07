import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import krStrings from 'react-timeago/lib/language-strings/ko';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Tags from '../Tags/Tags';
import TextButton from '../Button/TextButton/TextButton';
import ReduxFormField from '../ReduxFormField/ReduxFormField';
import './ArticleForm.scss';

const formatter = buildFormatter(krStrings);


class ArticleForm extends Component {
  componentWillMount() {
    if (this.props.formType === 'edit') {
      this.props.initialize({
        title: this.props.data.title,
        contents: this.props.data.contents,
        tags: this.props.data.tags
      });
    }
  }
  render() {
    const fieldClass = this.props.formType === 'edit' ? 'active' : '';
    const { handleSubmit, submitting } = this.props;
    let tags;
    let author;
    let date;
    let postNum;
    let authorId;
    let avatar;
    if (this.props.formType === 'edit') {
      ({
        author, date, postNum, authorId, avatar, tags
      } = this.props.data);
    }
    tags = tags || '';
    author = author || {};
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
      <div id="article-form">
        { this.props.formType === 'edit' && infoForEdit }
        <form onSubmit={handleSubmit(this.props.validateAndCreatePost)}>
          <Field
            name="title"
            type="text"
            component={ReduxFormField}
            mode="field"
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
            component={ReduxFormField}
            mode="rte"
            label="Content*"
            fieldClass={fieldClass}
          />
          <div className="article-new-btns">
            <TextButton
              type="submit"
              className="btn btn-primary submit"
              isLoading={submitting}
            >
              Save
            </TextButton>
            <Link
              to={this.props.formType !== 'edit' ? this.props.cancelUrl : '#'}
            >
              <TextButton
                onClick={() => {
                  this.props.formType === 'edit' && this.props.toggleEdit();
                }}
                className="btn btn-primary"
              >
                Cancel
              </TextButton>
            </Link>
          </div>
        </form>
      </div>

    );
  }
}
ArticleForm.defaultProps = {
  validateAndCreatePost: () => { console.warn('validateAndCreatePost is not defined'); },
  toggleEdit: () => { console.warn('toggleEdit is not defined'); },
  formType: '',
  cancelUrl: ''
};

ArticleForm.propTypes = {
  validateAndCreatePost: PropTypes.func,
  toggleEdit: PropTypes.func,
  formType: PropTypes.string,
  cancelUrl: PropTypes.string
};
function mapStateToProps(state) {
  return {
    data: state.posts.activePost.data
  };
}

export default reduxForm({
  form: 'PostForm'
})(connect(mapStateToProps)(ArticleForm));
