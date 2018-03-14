import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import krStrings from 'react-timeago/lib/language-strings/ko';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import TextButton from '../Button/TextButton/TextButton';
import ReduxFormField from '../ReduxFormField/ReduxFormField';
import './ArticlesForm.scss';

const formatter = buildFormatter(krStrings);


class ArticlesForm extends Component {
  componentWillMount() {
    if (this.props.formType === 'edit') {
      this.props.initialize({
        title: this.props.data.title,
        contents: this.props.data.contents
      });
    }
  }
  render() {
    const fieldClass = this.props.formType === 'edit' ? 'active' : '';
    const { handleSubmit, submitting } = this.props;
    let author;
    let date;
    let authorId;
    let avatar;
    if (this.props.formType === 'edit') {
      ({
        author, date, postNum, authorId, avatar
      } = this.props.data);
    }
    author = author || {};
    const infoForEdit = (
      [
        <div className="header" key="header">
          <Link to={`/userPage/${authorId}`}><img src={avatar} alt="" className="circle avartar_circle" /></Link>
          <div className="header-info">
            <div className="writer">{author.displayName}</div>
            <div className="created">Created : <TimeAgo date={date} formatter={formatter} /></div>
          </div>
        </div>
      ]
    );
    return (
      <div className={this.props.className}>
        { this.props.formType === 'edit' && infoForEdit }
        <form onSubmit={handleSubmit(this.props.validateAndCreateBoard)}>
          Board ID
          <Field
            name="boardId"
            type="text"
            component={ReduxFormField}
            mode="field"
            // label="Title*"
            fieldClass={fieldClass}
          />
          Description
          <Field
            name="description"
            component={ReduxFormField}
            mode="field"
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
              // to={`/articles/${this.props.match.params.id}`}
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
ArticlesForm.defaultProps = {
  validateAndCreateBoard: () => { console.warn('validateAndCreateBoard is not defined'); },
  toggleEdit: () => { console.warn('toggleEdit is not defined'); },
  formType: '',
  cancelUrl: ''
};

ArticlesForm.propTypes = {
  validateAndCreateBoard: PropTypes.func,
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
  form: 'BoardForm'
})(connect(mapStateToProps)(ArticlesForm));
