import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
import BreadCrumbs from '../../BreadCrumbs/BreadCrumbs';
import './BoardNew.scss';

const boardNewInputs = [
  {
    name: 'boardId', displayName: 'Board ID', type: 'text', icon: 'folder'
  },
  {
    name: 'description', displayName: 'Description', type: 'text', icon: 'insert_comment'
  }
];

const maxLength = max => (value) => {
  return value && value.length > max ? `${max}자 이하로 작성 해주세요.` : undefined;
};
const alphaNumeric = (value) => {
  return value && !(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|*\s]+$/.test(value))
    ? '게시판 제목에는 특수문자를 사용할 수 없습니다.'
    : undefined;
};
const required = value => (value ? undefined : '필수 사항입니다.');
const maxLength200 = maxLength(200);

class BoardNew extends Component {
  constructor(props) {
    super(props);
    const currentUrl = this.props.location.pathname;
    const indexOfPost = this.props.location.pathname.lastIndexOf('/');
    const baseUrl = currentUrl.substring(0, indexOfPost);
    this.state = {
      baseUrl,
      currentUrl
    };
  }

  validateAndCreatePost= (values) => {
    return this.props.createBoardRequest(values).then(() => {
      if (this.props.newBoard.status === 'SUCCESS') {
        this.props.history.push({ pathname: `${this.state.baseUrl}/${this.props.newBoard.data.boardId}` }).then(
          () => {
            Materialize.toast('Success!', 2000);
          }
        );

      } else {
        Materialize.toast($(`<span style="color: #00c853">Error: ${this.props.newBoard.error.message}</span>`), 3000);
      }
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="board_new">
        <div className="board_new_breadcrumbs">
          <BreadCrumbs url={this.state.currentUrl} />
        </div>
        <form onSubmit={handleSubmit(this.validateAndCreatePost)}>
          <div className="board_new_body">
            {
              boardNewInputs.map((input) => {
                return (
                  <Field
                    name={input.name}
                    type={input.type}
                    component={input.name === 'boardId' ? renderField : renderTextArea}
                    label={input.displayName}
                    key={input.name}
                    icon={input.icon}
                    validate={input.name === 'boardId' ? [required, alphaNumeric] : [required, maxLength200]}
                  />
                );
              })
            }
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }
}

// function validate(values) {
//   const errors = {};
//
//   // validation the inputs from 'values'
//   if (!values.boardId || values.boardId.trim() === '') {
//     errors.boardId = 'Enter a Title';
//   }
//   if (!values.description || values.description.trim() === '') {
//     errors.description = 'Enter some content';
//   }
//
//   if (!inputValidator.isUsername(values.boardId)) {
//     errors.boardId = '게시판 제목에는 특수문자를 사용할 수 없습니다.';
//   }
//
//   return errors;
// }

export default reduxForm({
  // validate,
  form: 'BoardNewForm'
})(
  withRouter(BoardNew)
);
