import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import renderField from './renderField';
import renderTextArea from './renderTextArea';
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

  validateAndCreatePost= (values) => {
    return this.props.createBoardRequest(values).then(() => {
      if (this.props.newBoard.status === 'SUCCESS') {
        this.props.history.push({ pathname: `/article/${this.props.newBoard.data.boardId}` }).then(
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

export default reduxForm({
  // validate,
  form: 'BoardNewForm'
})(
  withRouter(BoardNew)
);
