import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import krStrings from 'react-timeago/lib/language-strings/ko';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import Tags from '../../components/Tags/Tags';
import TextButton from '../../components/Button/TextButton/TextButton';
import ReduxFormField from '../../components/ReduxFormField/ReduxFormField';
import './ArticleNew.scss';

const formatter = buildFormatter(krStrings);

class ArticleNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // boardId: props.match.params.boardId
    };
    this.cancelUrl = `/articles/${this.state.boardId}`;
  }
  componentWillMount() {
    if (this.props.formType === 'edit') {
      this.props.initialize({
        title: this.props.title,
        contents: this.props.contents,
        tags: this.props.data.tags
      });
    }
  }
  validateAndCreatePost= (values) => {
    return this.props.createPostRequest(values, this.state.boardId).then(() => {
      if (this.props.newPost.status === 'SUCCESS') {
        this.props.history.push(`/article/${this.props.newPost.data._id}`).then(
          () => {
            Materialize.toast('Success!', 2000);
          }
        );
      } else {
        Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.newPost.error.message}</span>`), 3000);
      }
    });
  }
  render() {
    const { handleSubmit, submitting } = this.props;
    let author;
    let date;
    let postNum;
    let authorId;
    let avatar;
    let tags;
    // if (this.props.formType === 'edit') {
    //   ({
    //     author, date, postNum, authorId, avatar, tags
    //   } = this.props.data);
    // }
    tags = tags || '';
    author = author || {};
    const fieldClass = this.props.formType === 'edit' ? 'active' : '';
    // const infoForEdit = (
    //   [
    //     <div className="header" key="header">
    //       <Link to={`/userPage/${authorId}`}><img src={avatar} alt="" className="circle avartar_circle" /></Link>
    //       <div className="header-info">
    //         <div className="writer">{author.displayName}</div>
    //         <div className="created">Created : <TimeAgo date={date} formatter={formatter} /></div>
    //       </div>
    //     </div>,
    //     <div className="title" key="title">
    //       <div className="info">
    //         #{ postNum }
    //       </div>
    //     </div>
    //   ]
    // );
    return (
      <div id="article-new">
        {/* { this.props.formType === 'edit' && infoForEdit } */}
        <form onSubmit={handleSubmit(this.validateAndCreatePost)}>
          <Field
            name="title"
            type="text"
            component={ReduxFormField}
            mode="field"
            // label="Title*"
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
              to="#"
              // to={this.props.formType === 'edit' ? `/article/${this.props.data._id}` : this.cancelUrl}
            >
              <TextButton
                onClick={this.props.formType === 'edit' && this.props.toggleEdit}
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
ArticleNew.defaultProps = {
  formType: 'edit',
  title: 'title',
  contents: 'contents',
  data: {
    tags: 'pilot asdf zxcv 1234 asef toronto vancouver '
  },
  handleSubmit: () => {}, // redux form built in api
  submitting: true // redux form built in api
};

ArticleNew.propTypes = {
  formType: PropTypes.string,
  title: PropTypes.string,
  contents: PropTypes.string,
  data: PropTypes.object,
  submitting: PropTypes.bool,
  handleSubmit: PropTypes.func
};
export default ArticleNew;
