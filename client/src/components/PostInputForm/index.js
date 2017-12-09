import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import krStrings from 'react-timeago/lib/language-strings/ko';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import renderField from './renderField';
import renderRichTextEditor from './renderRichTextEditor';
import validate from './validatePost';
import Button from '../Button/Button';
import './PostInputForm.scss';

const formatter = buildFormatter(krStrings);

const tags = [ // 지금은 하드코딩으로..
  { name: 'toronto', link: '#' },
  { name: 'casmo', link: '#' },
  { name: 'killer', link: '#' }
];
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
    let authorName;
    let date;
    let postNum;
    if (this.props.formType === 'edit') {
      ({
        authorName, date, postNum
      } = this.props.data);
    }
    const fieldClass = this.props.formType === 'edit' ? 'active' : '';
    const infoForEdit = (
      [
        <div className="header" key="header">
          <Link to="/"><img src="/testIcon.png" alt="" className="circle avartar_circle" /></Link>
          <div className="header-info">
            <div className="writer">{authorName}</div>
            <div className="created">Created : <TimeAgo date={date} formatter={formatter} /></div>
          </div>
        </div>,
        <div className="title" key="title">
          <div className="info">
            #{ postNum }
            { tags.map((tag) => {
              return <Link to={`${tag.link}`} key={tag.name} className="tags">{tag.name}</Link>;
            })}
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
                      this.props.formType === 'edit' && `/community/${this.props.data.boardId}/${this.props.data._id}`}
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
    //
  };
}
export default reduxForm({
  validate,
  form: 'PostForm'
})(
  connect(mapStateToProps, mapDispatchToProps)(PostInputForm)
);
